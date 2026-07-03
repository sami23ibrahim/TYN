import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * Our Philosophy — left-bleed image (_Q3A1950, ~44%), heading + body on the right.
 * Design @1920: image left:2 w:840 h:599; "Our Philosophy" heading + body left:1011 w:633.
 * Column split at x842 → 842fr / 1078fr, text inset ~169px into the right track.
 */
export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="grid items-start gap-y-10 py-[clamp(3rem,7vw,7rem)] md:[grid-template-columns:842fr_1078fr]"
    >
      <div className="md:order-1">
        <Reveal className="w-full">
          <Image
            src="/images/philosophy.jpg"
            alt="A single cream-topped canapé garnished with an olive and spices, balanced on a stainless-steel cake server against a soft cream backdrop."
            width={840}
            height={599}
            sizes="(max-width: 768px) 100vw, 44vw"
            className="h-auto w-full object-cover"
          />
        </Reveal>
      </div>

      <div className="px-[var(--gutter)] md:order-2 md:pl-[clamp(2rem,8.8vw,10.5rem)] md:pr-[var(--gutter)]">
        <div className="max-w-[633px]">
          <h2 className="text-h2 text-wine">Our Philosophy</h2>
          <p className="mt-[clamp(1.5rem,3vw,2.5rem)] text-body text-wine">
            We work with a small number of clients each season, giving each event
            the full attention it deserves: seasonal ingredients, food prepared
            from scratch, and a sensibility that sits at the intersection of
            heritage and contemporary fine dining. All of our dishes are made with
            zero premade components, prepared fresh on the day of your event.
          </p>
        </div>
      </div>
    </section>
  );
}
