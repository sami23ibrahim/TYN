"use server";

import { headers } from "next/headers";

import { confirmationEmail, notificationEmail, type Email } from "@/lib/emails";
import { parseEnquiry, type EnquiryState } from "@/lib/enquiry";

const TO = process.env.ENQUIRY_TO || "info@tynkitchen.cz";
const FROM = process.env.ENQUIRY_FROM || "TÝN <info@tynkitchen.cz>";

const GENERIC_ERROR =
  "Sorry — we could not send your enquiry. Please try again, or email us directly at info@tynkitchen.cz.";

// ── Rate limit ─────────────────────────────────────────────────────────────
// Module-level, so it only covers one server instance. On Vercel that makes it a speed
// bump against casual abuse rather than an enforced quota; the honeypot does the heavier
// lifting against bots. Moving to Vercel KV / Upstash is the upgrade path if real spam
// arrives — not worth the dependency before then.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  // Prune other callers occasionally so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits)
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  // x-forwarded-for is a comma-separated chain; the first entry is the client.
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

// ── Sending ────────────────────────────────────────────────────────────────
// Resend's REST API directly rather than the SDK: one POST does not justify a fourth
// runtime dependency in a project that has three.
async function send(
  email: Email,
  to: string,
  replyTo?: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  // No key configured. In development, print the message so the whole flow can be
  // exercised before DNS verification completes. In production this is a misconfigured
  // deploy and must fail loudly — silently dropping enquiries is the worst outcome here.
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }
    console.log(
      `\n─── email (not sent — no RESEND_API_KEY) ───\nTo: ${to}\nReply-To: ${replyTo ?? "—"}\nSubject: ${email.subject}\n\n${email.text}\n───\n`,
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Resend responded ${res.status}: ${await res.text().catch(() => "")}`,
    );
  }
}

/**
 * Handle an enquiry submission: rate limit → honeypot → validate → send.
 *
 * The notification to TÝN is sent first because it is the email that must not be lost.
 * If the customer's confirmation fails afterwards we still report success — the lead is
 * safely delivered, and telling the customer to try again would only duplicate it.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot: a hidden field no human sees. Report success and send nothing — an error
  // would just teach the bot to retry.
  if ((formData.get("company") as string)?.trim()) {
    return { status: "success" };
  }

  if (rateLimited(await clientIp())) {
    return {
      status: "error",
      message:
        "You have sent several enquiries just now. Please wait a few minutes, or email us at info@tynkitchen.cz.",
    };
  }

  const parsed = parseEnquiry(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const data = parsed.data;

  try {
    await send(notificationEmail(data), TO, data.email);
  } catch (err) {
    console.error("[enquiry] notification failed", err);
    return { status: "error", message: GENERIC_ERROR, values: data };
  }

  try {
    await send(confirmationEmail(data), data.email);
  } catch (err) {
    console.error("[enquiry] confirmation to customer failed", err);
  }

  return { status: "success" };
}
