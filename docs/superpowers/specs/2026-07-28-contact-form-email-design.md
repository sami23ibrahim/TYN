# Contact form → email (Resend)

**Date:** 2026-07-28
**Status:** approved, implementing

## Goal

The footer enquiry form currently has an inert submit. Make it send two emails on a
valid submission:

1. **Notification to TÝN** — everything the customer filled in, so the enquiry can be
   answered without opening the site.
2. **Confirmation to the customer** — acknowledges receipt, summarises their enquiry,
   promises a reply within 48 hours.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Transport | Resend | Free tier covers the volume many times over; full control of both emails. Alternatives (Formspree, SMTP, Postmark, SES) traded away control, deliverability, or cost. |
| Resend client | `fetch` to `api.resend.com` | The SDK is one more dependency for a single POST. The project has three runtime deps and this keeps it that way. |
| Server entry point | Server Action + `useActionState` | The Next 16 idiom (see `node_modules/next/dist/docs/01-app/02-guides/forms.md`). No API route, no client fetch, the API key stays server-side. |
| Validation | Hand-rolled | Nine fields do not justify adding `zod`. |
| Notification inbox | `info@tynkitchen.cz` | Already the published address in the footer. |
| Confirmation `From` | `info@tynkitchen.cz` | A monitored mailbox — a customer replying to the confirmation reaches a human. |
| Spam | Honeypot + per-IP rate limit | No third-party service, no friction for real users. |

## Architecture

| File | Responsibility | Depends on |
| --- | --- | --- |
| `lib/enquiry.ts` | Field list, types, pure validator. | nothing |
| `lib/emails.ts` | Two template functions → `{subject, html, text}`. | `lib/enquiry.ts` |
| `app/actions/enquiry.ts` | Rate limit → honeypot → validate → send → return state. | both of the above |
| `components/ContactForm.tsx` | `useActionState`, inline errors, pending/success/error UI. | the action |

Each is independently readable: the validator can be reasoned about with no knowledge of
email, and the templates with no knowledge of HTTP.

## Data flow

```
submit → Server Action
           ├─ rate limit (per IP)      → over limit? generic error
           ├─ honeypot filled?         → fake success, send nothing
           ├─ validate                 → invalid? field errors + submitted values back
           ├─ send notification to TÝN → failed? error + "email us directly" fallback
           ├─ send confirmation        → failed? log only, still report success
           └─ success
```

**Send order is deliberate.** The notification goes first because it is the email that
must not be lost. If the confirmation fails afterwards, TÝN still has the lead, so the
customer is shown success rather than being told to submit again (which would duplicate
the enquiry).

## Validation rules

| Field | Rule |
| --- | --- |
| name | required, 2–100 chars |
| email | required, single `@`, a dot in the domain, ≤ 200 |
| phone | required, 5–40, digits and `+ - ( ) space` only |
| date | required, `YYYY-MM-DD`, at least 6 days ahead (client asks for 7; server allows one day of slack for timezone skew) |
| people | required, integer 1–2000 |
| budget | optional, ≤ 100 |
| place | required, 2–200 |
| eventType | required, must be one of the known options |
| eventDuration | required, must be one of the known options |
| note | optional, ≤ 5000 |

The option lists move from `ContactForm.tsx` into `lib/enquiry.ts` so the form and the
server validate against one source.

## Spam handling

- **Honeypot**: a `company` field, visually hidden, `tabindex="-1"`, `autocomplete="off"`,
  `aria-hidden`. If non-empty the action returns success and sends nothing — a bot that
  gets an error learns to retry.
- **Rate limit**: 3 submissions per IP per 10 minutes, held in module memory.

**Known limitation:** serverless instances do not share memory, so the rate limit is a
speed bump, not an enforced quota. Upgrading to Vercel KV / Upstash is the fix if spam
appears; not worth the dependency before then.

## Configuration

| Variable | Required | Default |
| --- | --- | --- |
| `RESEND_API_KEY` | to actually send | — |
| `ENQUIRY_TO` | no | `info@tynkitchen.cz` |
| `ENQUIRY_FROM` | no | `TÝN <info@tynkitchen.cz>` |

**Dev fallback:** with no `RESEND_API_KEY`, the action logs both emails to the server
console instead of sending, and reports success. This makes the whole flow testable before
DNS verification completes. It applies in development only — in production a missing key
is a hard error, so a misconfigured deploy fails loudly instead of silently dropping
enquiries.

## Manual setup (outside the repo)

1. Resend → Domains → add `tynkitchen.cz`, EU (Ireland) region.
2. Add the SPF/DKIM/DMARC records at GoDaddy. GoDaddy appends the domain automatically —
   enter `send`, not `send.tynkitchen.cz`.
3. Resend → API keys → sending-only key.
4. Add `RESEND_API_KEY` to the Vercel project `tyn` and to local `.env.local`.

## Testing

- Local, no key: submit and read both rendered emails from the dev server console.
- Validation: empty submit, past date, bad email, oversized note.
- Honeypot: fill the hidden field via devtools → success with nothing logged.
- Rate limit: four rapid submissions → the fourth is refused.
- Once DNS verifies: a real submission, checking both inboxes and the Resend log.
