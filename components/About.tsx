import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * About TÝN — heading + three paragraphs at the TOP-left, the Sam Darwish portrait
 * pushed to the BOTTOM-left, and the right-bleed spoons image. The spoons image and the
 * portrait share the same bottom line (design: spoons bottom 4346, portrait bottom 4349),
 * so the left column is a full-height flex column (text top, portrait mt-auto) and the
 * spoons image bottom-aligns (self-end).
 *
 * Design @1920: heading/body left:108 (body w586); portrait left:105 w:403 h:543;
 * spoons right-bleed left:842 w:1077 h:1395. Column split at x842 → 842fr / 1078fr.
 */
export default function About() {
  return (
    <section
      id="about"
      className="grid gap-y-10 py-[clamp(3rem,7vw,7rem)] md:items-stretch md:[grid-template-columns:842fr_1078fr]"
    >
      {/* Left column: text at the top, portrait pushed to the bottom */}
      <div className="flex flex-col px-[var(--gutter)] md:pr-[clamp(2rem,4vw,5rem)]">
        <div className="max-w-[586px]">
          <Reveal variant="text">
            <h2 className="text-h2 text-wine">About TÝN</h2>
          </Reveal>
          <Reveal variant="text" delay={90}>
            <div className="mt-[clamp(1.5rem,3vw,2.5rem)] space-y-[clamp(1.25rem,2.5vw,2rem)] text-body text-wine">
              <p>
                Named after the Arabic word for figs, TÝN celebrates the traditions
                of hospitality, generosity, and gathering around food.
              </p>
              <p>
                We believe that great events begin with a great table. Our menus draw
                inspiration from the rich culinary heritage of the Middle East while
                embracing a contemporary approach to cooking and presentation.
              </p>
              <p>
                By working with a limited number of clients each season, we are able
                to create thoughtful, personalised experiences where every detail
                matters, from the ingredients we source to the final dish served.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Portrait: mt-auto drops it to the column bottom (desktop) so its bottom edge
            meets the spoons image bottom. */}
        <figure className="relative mt-[clamp(2rem,4vw,3.5rem)] max-w-[423px] md:mt-auto">
          <Reveal className="w-full">
            <Image
              src="/images/sam-darwish.jpg"
              alt="Sam Darwish and two colleagues preparing an array of mezze dishes at a table."
              width={1269}
              height={1629}
              sizes="(max-width: 768px) 90vw, 423px"
              // Pre-cropped to the designer's framing: source region x137 y971
              // 2200×2824 of the 2731×4096 original (design-reference/originals/).
              // Previously rendered 403×604 — h-auto let the file's 0.667 ratio win
              // over the declared 403×543 — and because this figure is bottom-anchored
              // (md:mt-auto) the surplus height grew UPWARD into the paragraphs.
              // Locked to Figma node 22:2 (423×543).
              className="aspect-[423/543] w-full object-cover"
            />
          </Reveal>
        </figure>
      </div>

      {/* Right column: spoons image, bottom-aligned to the portrait baseline, right-bleed */}
      <div className="md:order-2 md:self-end">
        <Reveal className="w-full">
          <Image
            src="/images/about-spoons.jpg"
            alt="A whole spice-crusted roast lamb shoulder on a fluted cream platter, garnished with rosemary and thyme in a pool of golden jus."
            width={1077}
            height={1395}
            sizes="(max-width: 768px) 100vw, 56vw"
            // The file is the uncropped 2731×4096 original (0.667). With h-auto the
            // browser sizes from the FILE's ratio and the design crop never applies —
            // lock the box to the Figma ratio (node 3:1628) so object-cover binds.
            className="aspect-[1077/1395] w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
