# Worklog — designer feedback round 1

**Session: 2026-07-20.** Working through five points from the designers, one at a time.
Nothing is committed or deployed yet — all of the below is local only. Live site is still `4a97427`.

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

**Pre-existing lint error**, untouched by this work: `ContactForm.tsx:40`, setState in an effect
(from the hydration-safe date logic).

---

## Also worth doing

- `README.md` token table is stale — documents the green palette that no longer exists.
- Email drafted to the designers but **not sent**: it says "please take a look", which points at the
  deployed site. Nothing is deployed. Push first, or reword.
