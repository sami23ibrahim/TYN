/**
 * The two emails an enquiry produces. Pure templating — these build strings and know
 * nothing about how they are sent.
 *
 * Deliberately hand-written HTML with inline styles and a table layout: email clients
 * strip <style> blocks and have no CSS grid, so the usual component approach does not
 * survive the trip. Every message also carries a plain-text alternative, which matters
 * both for text-only clients and for spam scoring.
 */

import { FIELD_LABELS, type Enquiry } from "@/lib/enquiry";

const CREAM = "#fffef7";
const WINE = "#7e283e";

export type Email = { subject: string; html: string; text: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Newlines survive escaping but not HTML rendering; the note field needs them back. */
function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

/** "2026-09-12" → "12 September 2026". Falls back to the raw value if unparseable. */
function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function displayValue(field: string, value: string): string {
  if (!value) return "—";
  return field === "date" ? formatDate(value) : value;
}

/** The enquiry as a two-column table; shared by both emails. */
function detailRows(data: Enquiry): string {
  return FIELD_LABELS.map(([field, label]) => {
    const value = displayValue(field, data[field]);
    return `<tr>
      <td style="padding:6px 16px 6px 0;vertical-align:top;white-space:nowrap;color:${WINE};opacity:0.7;font-size:14px;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;vertical-align:top;color:${WINE};font-size:15px;">${escapeMultiline(value)}</td>
    </tr>`;
  }).join("");
}

function detailLines(data: Enquiry): string {
  return FIELD_LABELS.map(
    ([field, label]) => `${label}: ${displayValue(field, data[field])}`,
  ).join("\n");
}

function shell(inner: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:${CREAM};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:${CREAM};">${inner}</div>
</body></html>`;
}

/**
 * To TÝN. The subject carries enough to triage from the inbox list without opening it,
 * and Reply-To is set to the customer at send time so a plain reply reaches them.
 */
export function notificationEmail(data: Enquiry): Email {
  const subject = `New enquiry — ${data.name}, ${data.eventType}, ${formatDate(data.date)}`;

  const html = shell(`
    <h1 style="margin:0 0 4px;font-size:22px;font-weight:600;color:${WINE};">New enquiry</h1>
    <p style="margin:0 0 20px;font-size:14px;color:${WINE};opacity:0.7;">From the tynkitchen.cz contact form. Reply to this email to answer ${escapeHtml(data.name)} directly.</p>
    <table style="border-collapse:collapse;width:100%;">${detailRows(data)}</table>
  `);

  const text = `New enquiry from the tynkitchen.cz contact form.
Reply to this email to answer ${data.name} directly.

${detailLines(data)}`;

  return { subject, html, text };
}

/** To the customer. Confirms receipt and reflects their answers back for checking. */
export function confirmationEmail(data: Enquiry): Email {
  const firstName = data.name.split(" ")[0] || data.name;

  const html = shell(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:${WINE};">Thank you for your enquiry</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${WINE};">Dear ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${WINE};">
      Thank you for getting in touch with TÝN. We have received your enquiry and will come
      back to you within 48 hours to discuss your event.
    </p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${WINE};">Here is what you sent us:</p>
    <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">${detailRows(data)}</table>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${WINE};">
      If anything above is not right, simply reply to this email and we will correct it.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:${WINE};">
      Warm regards,<br />TÝN
    </p>
    <p style="margin:24px 0 0;font-size:13px;color:${WINE};opacity:0.6;">
      info@tynkitchen.cz &nbsp;·&nbsp; tynkitchen.cz
    </p>
  `);

  const text = `Dear ${firstName},

Thank you for getting in touch with TÝN. We have received your enquiry and will come back
to you within 48 hours to discuss your event.

Here is what you sent us:

${detailLines(data)}

If anything above is not right, simply reply to this email and we will correct it.

Warm regards,
TÝN
info@tynkitchen.cz · tynkitchen.cz`;

  return { subject: "We have received your enquiry — TÝN", html, text };
}
