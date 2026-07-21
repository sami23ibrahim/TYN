import ServiceItem from "@/components/ui/ServiceItem";
import ConceptGallery from "@/components/HorizontalConcepts";
import Reveal from "@/components/ui/Reveal";

/**
 * Feature section on the blush (#f7beb7) panel — every text element here is oxblood
 * (#45110e). A centered "Tailored Concepts" heading (52px) + centered intro (34px), a
 * 2×2 services grid, then a horizontal-scroll image strip: when it's reached the strip
 * pins and vertical scroll brings the next photo into view (see ConceptGallery).
 *
 * Design @1920: blush panel; heading centered top:7142; intro centered w:1119 top:7284.
 * Grid columns left:154 / left:1075, each w:686, rows top:7608 & 7940.
 */
export default function TailoredConcepts() {
  return (
    <section id="tailored" className="bg-blush text-oxblood">
      {/* Centered heading + intro */}
      <div className="px-[var(--gutter)] pt-[clamp(3rem,10.4vw,12.5rem)] text-center">
        <Reveal variant="text">
          <h2 className="text-feature">Tailored Concepts</h2>
        </Reveal>
        <Reveal variant="text" delay={90}>
          <p className="mx-auto mt-[clamp(1.25rem,3.3vw,4rem)] max-w-[1119px] text-feature-body">
            We design distinct menus tailored to honour the specific character
            <br className="hidden md:block" />
            of your event and reflect the true warmth of Levantine hospitality.
          </p>
        </Reveal>
      </div>

      {/* 2×2 services grid — Weddings / Corporate Catering ; Special Projects / Private Events.
          No delay here: the grid sits far below the heading and crosses the trigger line on
          its own, so a stagger measured against the heading would never be perceived. */}
      <Reveal variant="text">
        <div className="mt-[clamp(2.5rem,5.8vw,6.9rem)] grid gap-y-[clamp(2rem,3.3vw,4rem)] px-[clamp(1.25rem,8vw,9.625rem)] md:grid-cols-2 md:gap-x-[clamp(2rem,12.24vw,14.6875rem)]">
          <ServiceItem title="Weddings">
            Beautifully curated menus designed to accompany every moment of your
            celebration. From welcome drinks and mezze spreads to late-night
            feasting, we create experiences your guests will remember long after
            the day ends.
          </ServiceItem>
          <ServiceItem title="Corporate Catering">
            Thoughtful catering for launches, conferences, team gatherings, and
            client events. Professional, seamless, and always memorable.
          </ServiceItem>
          <ServiceItem title="Special Projects">
            Pop-ups, brand collaborations, cultural events, and bespoke culinary
            experiences.
          </ServiceItem>
          <ServiceItem title="Private Events">
            Birthdays, anniversaries, garden parties, and intimate dinners. We
            tailor every menu to the occasion, creating a unique experience for
            you and your guests.
          </ServiceItem>
        </div>
      </Reveal>

      {/* Horizontal-scroll image strip (pins on reach, scroll brings the next photo) */}
      <div className="mt-[clamp(2.5rem,6.2vw,7.4375rem)] pb-[clamp(3rem,15.8vw,18.9375rem)]">
        <ConceptGallery />
      </div>
    </section>
  );
}
