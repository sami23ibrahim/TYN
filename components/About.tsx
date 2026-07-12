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
          <h2 className="text-h2 text-wine">About TÝN</h2>
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
        </div>

        {/* Portrait: mt-auto drops it to the column bottom (desktop) so its bottom edge
            meets the spoons image bottom. */}
        <figure className="relative mt-[clamp(2rem,4vw,3.5rem)] max-w-[403px] md:mt-auto">
          <Reveal className="w-full">
            <Image
              src="/images/sam-darwish.jpg"
              alt="Sam Darwish and two colleagues preparing an array of mezze dishes at a table."
              width={403}
              height={543}
              sizes="(max-width: 768px) 90vw, 403px"
              className="h-auto w-full object-cover"
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
            className="h-auto w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
