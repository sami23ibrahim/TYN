# TÝN — Web

A faithful, responsive front-end clone of the TÝN catering landing page, rebuilt by eye from the
flat Figma export in [`design-reference/`](./design-reference). Built with **Next.js 16 (App
Router) + TypeScript + Tailwind CSS v4**. Presentational only — no backend/data logic this pass.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Design tokens (`app/globals.css`)

Colors were sampled pixel-exact from the export; type sizes were derived from text-width ÷
char-count on the 1920px artboard (the design uses a deliberately compressed scale).

| Token | Value | Role |
|---|---|---|
| `--color-cream` | `#FFFEF7` | page background + footer text |
| `--color-ink` | `#365229` | all type, logo, nav, borders |
| `--color-pistachio` | `#C0D77E` | "Our Signatures" panel |
| `--color-wine` | `#7E283E` | footer |

Type scale: `text-display` (~42px) · `text-h2` (~40px) · `text-h3` (~30px) · `text-body` (~21px) ·
`text-nav` (~32px) · `text-btn` · `text-caption` — all fluid via `clamp()`.

## ⚠️ Real assets you still need to supply

Every image in `public/images/` was **sliced from the flat export (`design-reference/UI.png`)** as
a faithful stand-in. They're comp-resolution — replace each with the production original (keep the
same filename = no code changes needed):

| File | Section | Notes |
|---|---|---|
| `logo-tyn.png` | Header | Painted TÝN wordmark. **Best: supply the original vector (SVG).** |
| `hero-mezze.jpg` | Hero | Full-bleed mezze spread |
| `vase-figs.jpg` | Intro | Blue vase + figs |
| `spoons-dips.jpg` | About | Two spoons (muhammara / hummus) |
| `sam-darwish.jpg` | About | Chef portrait |
| `tartlet-server.jpg` | Philosophy | Tartlet on a cake server |
| `tray-tartlets.jpg` | How We Serve | Hands passing a tray |
| `sunflower-plate.jpg` | How We Serve | Sunflower plate |
| `signature-dish.jpg` | Our Signatures | Plated lamb + rice |
| `kunafa-pull.jpg` | Tailored Concepts | Kunafa cheese-pull |

Also supply:
- **Brand typeface** — the export's sans is a geometric-humanist face; I used **Poppins** as the
  closest free match (`app/layout.tsx`). Swap in the real font when you have it.
- **Logo vector** — replace `logo-tyn.png` with the brand SVG for crispness at any size.

## Responsive choices (the export only showed desktop)

- Nav collapses to a hamburger/disclosure menu below `md`.
- Two-column text/image rows stack to one column; full-bleed images stay full-width.
- 2×2 services grid → single column on mobile.
- Type and gutters scale fluidly with `clamp()`.

## Assumptions / things to refine (`// TODO` in code)

- Nav targets for **Events** / **Gallery** (no dedicated sections in this one-pager) point at the
  nearest relevant anchors.
- **"Our menu"** button has no menu page yet → points at `#signatures`.
- **Contact form** (footer) is inert — no backend wired.
- Exact spacing, hover/interaction states, and a few image crops were inferred from a flat export
  and may need fine-tuning against the live design file.

## Structure

```
app/             layout.tsx · page.tsx · globals.css · global-error.tsx
components/       Header · Hero · Intro · About · Philosophy · HowWeServe ·
                  Signatures · TailoredConcepts · Footer · ContactForm
components/ui/    Container · Button · SplitSection · ServiceItem
public/images/    sliced assets (replace with originals)
design-reference/ UI.png · TÝN WEB.pdf  (the source export)
```
