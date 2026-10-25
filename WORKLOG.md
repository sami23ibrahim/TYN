# Worklog

Newest session first.

---

# Session 2026-10-25 — "Premium" out of the page title, real favicon

Committed and pushed.

## 1. Page title and description

"Premium" had only been removed from the hero (2026-07-28). The `<title>` and meta description still had
it, so it showed in browser address-bar suggestions and Google results.

- `<title>` → **"TÝN — Levantine Catering"**
- Description now opens **"Catering crafted with…"**, matching the hero.

Browsers keep the old title in history until the site is next visited; Google updates on its next crawl.

## 2. Favicon — TÝN logo replaces the Next.js triangle

`app/favicon.ico` was still the create-next-app default. All icons are now generated from
`public/images/logo-tyn.svg`: cream (`#fffef7`) wordmark on a wine (`#7e283e`) tile.

| File | Size | Used by |
|---|---|---|
| `app/favicon.ico` | 16 / 32 / 48 | browser tabs, bookmarks |
| `app/icon.png` | 192 | Google results, Android, hi-DPI |
| `app/apple-icon.png` | 180 | iPhone/iPad Safari, home screen |

Next.js links all three by file convention — no code involved.

- **Wine tile, not cream:** a cream tile vanished against a white tab bar. Cream-on-wine is already the
  footer's pairing.
- **Strokes thickened at small sizes only** (+0.6px at 16, +0.45 at 32, +0.3 at 48). The brush lines are
  under a pixel wide at 16px and disappeared. 180 and 192 are the true logo weight.
- **`apple-icon` is full-bleed and opaque** — iOS rounds the corners itself and renders transparency black.
- Rendered with `sharp` (installed with Next). The script was not committed; to redo, centre the logo's
  4 paths on the tile with 5% side padding (10% for `apple-icon`) and an 18% corner radius.

Verified: build lists the icon routes, `<head>` links them (48x48, 192x192, 180x180), and `next start`
serves each byte-identical to its file.

---

# Session 2026-07-28 — client tweaks + contact form goes live

Everything below is **committed and pushed** (`8c2e7bc`, `1343a47`). One external dependency is
still outstanding: the DNS records that make email actually send.

## Status

| # | Item | Status |
|---|---|---|
| 1 | Nav type 25% smaller, header band shorter | **Done**, deployed |
| 2 | "Premium" removed from the hero headline | **Done**, deployed |
| 3 | Words fusing on mobile around hidden `<br>` | **Done** — was a JSX bug, found in 3 places |
| 4 | Swipe the Tailored Concepts gallery on phones | **Done**, deployed |
| 5 | Contact form sends email via Resend | **Code done and deployed**; blocked on DNS |

---

## 1. Header — smaller nav, shorter band

- `--text-nav` 30px → **22.5px** @1920 (exactly −25% across the whole clamp range).
- Header band **123px → 78px**. Most of that was the **logo (71 → 54px)**, not padding
  (16 → 12px). The logo sets the band height; trimming padding alone barely moves it.

Third revision of these numbers (see the 2026-07-20 session). The token comment in
`globals.css` carries the history so nobody "restores" the Figma value.

## 2. Hero copy

"Premium catering crafted with…" → **"Catering crafted with…"** (`Intro.tsx`).

The same sentence is still duplicated verbatim in the SEO metadata (`layout.tsx:19`), and the
`<title>` still reads "TÝN — Premium Levantine Catering". Both left alone deliberately — neither
is visible on the page. ~~Flagged to the user, no decision yet.~~ **Removed from both 2026-10-25.**

## 3. Mobile line breaks — a JSX bug, not CSS

`components/TailoredConcepts.tsx` rendered "specific characterof your event" on phones.

Cause: JSX strips the newline between a text line and a tag on the line below. With
`<br className="hidden md:block" />` display-none at mobile widths, the two text runs became
adjacent with no separator. Desktop was fine because the `<br>` supplied the break.

Fixed with an explicit `{" "}` before each `<br>`. **The same latent bug existed in two more
places** in `Intro.tsx` ("crafted witha touch", "celebrationsand corporate events") — also fixed.

**If you add another `hidden md:block` `<br>`, put `{" "}` before it.** There is a comment saying so.

## 4. Gallery swipe

`HorizontalConcepts.tsx` now takes a swipe as well as the arrows:

- Pointer events, so touch, pen and mouse-drag all use one code path.
- The track follows the finger 1:1; easing is switched off mid-drag so it can't lag behind.
- Commits past **15% of frame width (min 40px)**, otherwise springs back.
- The gesture locks to an axis after an 8px slop, and the viewport is `touch-pan-y`, so
  vertical page scrolling through the section is unaffected.

Verified in a 390×844 touch browser: next/prev/wrap all correct, sub-threshold drag springs back,
vertical swipe scrolls the page (5332 → 5517) without changing the slide.

---

## 5. Contact form → Resend

Design doc: `docs/superpowers/specs/2026-07-28-contact-form-email-design.md`.

Submitting now sends **two** emails: the enquiry to `info@tynkitchen.cz` (Reply-To set to the
customer) and a confirmation to the customer promising a reply **within 48 hours**.

| File | Job |
|---|---|
| `lib/enquiry.ts` | Fields, types, pure validator, shared state type. No I/O. |
| `lib/emails.ts` | The two templates. No sending. |
| `app/actions/enquiry.ts` | Server action: rate limit → honeypot → validate → send. |
| `components/ContactForm.tsx` | `useActionState`, inline errors, pending/success UI. |

**Send order is deliberate.** The notification to TÝN goes first because it is the email that must
not be lost. If the customer confirmation fails afterwards, success is still reported — telling the
customer to retry would only duplicate an enquiry you already have.

**No `RESEND_API_KEY` → the action logs both emails to the console instead of sending**, but only in
development. In production a missing key throws, so a misconfigured deploy fails loudly rather than
silently dropping enquiries. This is what made the whole flow testable before DNS existed.

Resend's REST API is called with `fetch` rather than the SDK — one POST does not justify a fourth
runtime dependency in a project that has three.

### Spam

Honeypot `company` field (offscreen, `tabindex="-1"`, `aria-hidden`) — if filled, success is
reported and **nothing is sent**; an error would just teach the bot to retry. Plus 3 submissions per
IP per 10 minutes.

**The rate limit is a speed bump, not a quota.** It lives in module memory and Vercel runs multiple
instances. Upstash / Vercel KV is the upgrade if real spam arrives — not before.

### Verified end to end (real browser, dev server)

- Bad payload with native validation bypassed → 8 correct field errors, submitted values preserved.
- Valid submission → both emails correct, diacritics intact (`Jana Nováková`, `TÝN`), Reply-To set.
- Honeypot filled → success shown, **0 emails logged**.
- `eslint`, `tsc --noEmit` and `next build` all clean.

### Outstanding

1. **DNS records are with a third party.** Sami has no GoDaddy access. Three records were sent:
   `resend._domainkey` TXT (DKIM), `send` MX → `feedback-smtp.eu-west-1.amazonses.com` pri 10,
   `send` TXT → `v=spf1 include:amazonses.com ~all`. Then click **verify** in Resend.
2. **Until verified, submissions fail** with "email us directly at info@tynkitchen.cz". Shipped
   anyway because the previous live behaviour was worse — it told real customers the form was
   "a presentational placeholder" and dropped the enquiry silently.
3. **Confirm `info@tynkitchen.cz` actually receives mail.** Resend only sends. If that mailbox does
   not exist, enquiries will report success and vanish. Not yet verified.
4. **Rotate the API key.** It was pasted into a chat transcript. Sending-only scope, so low risk,
   but replace it once things work.

---

## Gotchas learned this session

**A `"use server"` module may only export async functions.** `initialEnquiryState` had to move to
`lib/enquiry.ts`; exporting the constant beside the action is a build error.

**`.gitignore`'s `.env*` also swallows `.env.example`.** Needs an explicit `!.env.example`.

**`h-full` does not resolve against a parent's `min-height`.** The footer box uses `md:min-h-[…]`,
so the post-submit confirmation sat at the top instead of centred. Fixed by making the box
`flex flex-col` and the children `flex-1` — no duplicated magic number.

**Fixed the pre-existing `set-state-in-effect` lint error** in `ContactForm.tsx`. The date floor is
now written to the DOM via a ref after mount. It cannot be server-rendered: the page is statically
prerendered, so a server-computed `min` would freeze at build time.

---

# Session 2026-07-20 — designer feedback round 1

Working through five points from the designers, one at a time.
Nothing is committed or deployed yet — all of the below is local only. Live site is still `4a97427`.

**Superseded since:** points 1 and 4 were revisited on 2026-07-28 (header numbers changed again);
the `ContactForm.tsx` lint error noted under "Blockers" is now fixed.

---

## Status

| # | Point | Status |
|---|---|---|
| 1 | Menu text too large on desktop | **Done** |
| 2 | Apply the image scroll animation consistently | **Done** (was a bug) |
| 3 | Subtle scroll animation on text blocks | **Done** |
| 4 | Images cropped differently than the design | **Partial** — 2 of 5 fixed |
| 5 | Mobile version | **Not started** — awaiting designer approval |

---

## 1. Menu size — done

- `--text-nav` 36px → **30px** (`globals.css`)
- Header padding 36px → 26px; logo 83px → 71px tall
- Header height **155px → 123px**

**Deliberate divergence from Figma:** the design says 24px. 24px read as too small in-browser, so
we sat between the original 36px and their 24px. Noted in the token comment so nobody "corrects"
it back. The designers set 24px explicitly and will likely query it.

## 2. Image scroll animation — done (this was a bug, not a missing feature)

The reveal was *already* on every image. `Reveal.tsx` carried a `setTimeout(reveal, 5000)` safety
net; since every instance mounts at page load on a one-pager, it fired for the whole page at once
and each below-the-fold image animated off-screen. Only the first image you reached looked animated.

Fixed by deleting that timeout and switching the trigger to `IntersectionObserver`
(no scroll-event dependency, so no fallback needed). Also fixed a latent case where refreshing
mid-page left images *above* the viewport armed-but-hidden.

**Do not reintroduce a blanket timeout in that file.** There's a comment saying so.

Hero stays deliberately excluded (it's above the fold — confirmed with the designers' intent).

## 3. Text block animation — done

New `.reveal-text` variant: `opacity 0→1` + `translateY(14px→0)`, **720ms** ease-out, no scale.
Deliberately *not* the image treatment — a clip wipe reads as a curtain on type, and the image
effect's `scale(1.08)` start makes glyphs render soft mid-animation.

14 blocks wrapped across 6 components. Heading leads its body by **90ms**.
Exception: the Tailored Concepts services grid has no delay — it crosses the trigger line
independently of its heading, so a stagger there would never be perceived.

Contact form inputs deliberately **not** animated (fading in fields the user is reaching for reads
as lag). Footer heading and contact details are.

## 4. Image crops — partial

### Root cause (this was our bug, not bad assets)

Files in `public/images/` are full-frame camera originals (4096×2731 / 2731×4096). The code
declared the *design's* dimensions in `width`/`height`, but the CSS was `h-auto w-full object-cover`.

Browsers apply `aspect-ratio: auto attr(width)/attr(height)` — the `auto` keyword means the declared
ratio is used **only until the file loads**, then the file's natural ratio takes over for
`height: auto`. So the design crop was declared and silently discarded, and `object-cover` had
nothing to crop because the box already matched the file.

**Second, larger problem:** even with the right ratio, `object-cover` centre-crops, while the
designer positioned each photo *by hand* inside its Figma frame. Fixing the ratio gets the right
*shape*, not the right *framing*. serve-tray was showing ~100% of the frame where the design shows
about 36% of it.

### Fixed

| Image | Crop source | Result |
|---|---|---|
| `serve-tray.jpg` | estimated from designer screenshot | 12.4 MB → 372 KB |
| `sam-darwish.jpg` | estimated from designer screenshot | 12.2 MB → 415 KB |

`sam-darwish` also fixed a visible layout bug: it rendered 403×604 instead of 423×543, and because
the figure is bottom-anchored (`md:mt-auto`) the surplus height grew *upward* into the paragraphs.

Uncropped originals are in **`design-reference/originals/`** (gitignored, outside the web root).
Re-cropping is one command if framing needs a nudge.

### Outstanding

- `about-spoons.jpg` — ratio corrected, framing unverified
- `plated-dish.jpg` — ratio corrected, framing unverified
- `tailored-tray.jpg` — **may be a different photo now.** The Figma node in that slot is named
  `_Q3A2026 1`, the same source photo as the plated-dish band, while our file is the tartlet tray.
  Ask the designers before touching it.

---

## 5. Mobile — not started

Design confirmed real: frame **`208:2`, 390×6340**. Full geometry captured (positions + sizes of
every node), but **never viewed** — rendering a screenshot needs a Figma call and we're out of quota.

**Good news:** every mobile image ratio matches its desktop counterpart, so the cropped assets carry
straight over. One exception — Philosophy's second image is `390×434` (0.899) on mobile vs
`1601×1049` (1.526) on desktop, and has a different node name (`_Q3A2026 2`). That needs its own asset.

**Blocked on:** designer confirmation that the mobile design is approved and final.

---

## Do this first tomorrow

**Two authoritative Figma exports are already sitting untracked in `public/images/`** — exact design
node dimensions, i.e. the real crops, better than the estimates currently in place:

| File | Size | Matches | Action |
|---|---|---|---|
| `_Q3A2277 2 (1).png` | 1128×721 | serve-tray, node `136:2` | **replace** the estimated crop |
| `_Q3A2026 1 (1).png` | 1601×1049 | plated-dish, node `3:1642` | **apply** — closes one outstanding item |

Also untracked, unidentified: `public/new images/2–7.png` (1624×1082, matches the gallery slides
`tailored-2…7.png`), `public/new images/_Q3A1950 3.png` (440×562, matches node `176:6`),
`serve-plate-2.jpg` (4096×2731, uncropped original — unclear which slot).

Ask the user what these are before wiring them in.

---

## Blockers and gotchas

**Figma MCP: 6 tool calls per MONTH on the Starter plan.** Not per day. All six were spent on
2026-07-20. Next reset date unknown (calendar month vs billing anniversary — docs don't say).
Professional plan with a **Full or Dev seat** gives 200/day; a View/Collab seat stays at 6/month
even on Professional. Until then: work from user-supplied screenshots — that produced both crops.

**The site renders in Poppins, not Strawford.** `layout.tsx` loads Poppins from Google Fonts as a
stand-in; Strawford is commercial (Fontfabric) and the files were never supplied. This is the single
biggest 1:1 gap — different letterforms, widths and line breaks on every text element.
**Consequence for sequencing:** different line breaks mean different text-block heights, so
pixel-chasing vertical spacing before the real font lands is partly wasted work.

**`design-reference/UI.png` is the OLD GREEN design.** Predates the burgundy rebrand and has
different photos in the How We Serve slots. Do not use it as a crop or colour reference.
The stale palette in `README.md` (`--color-ink #365229`, `--color-pistachio`) comes from the same era.

**The designers' file is mid-edit.** The hero photo sits just outside the artboard on *both* the
desktop and mobile frames, so both hero slots read as empty.

**Next caches optimised images.** After swapping anything in `public/images/`, a full
`rm -rf .next` + dev-server restart is required or you'll keep seeing the old image.
Same applies to editing the `@theme` block in `globals.css` — this bit us twice today.

~~**Pre-existing lint error**, untouched by this work: `ContactForm.tsx:40`, setState in an effect
(from the hydration-safe date logic).~~ **Fixed 2026-07-28** — now a ref write after mount.

---

## Also worth doing

- `README.md` token table is stale — documents the green palette that no longer exists.
- Email drafted to the designers but **not sent**: it says "please take a look", which points at the
  deployed site. Nothing is deployed. Push first, or reword.
