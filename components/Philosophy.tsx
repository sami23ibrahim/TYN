import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * Our Philosophy — left-bleed image (~44%) + heading/body on the right, then a wide
 * plated-dish band (_Q3A2026 1, Figma node 3:1642) right-bleed below the row.
 * Column split at x842 → 842fr / 1078fr, text inset ~169px into the right track.
 * Design @1920 band: left:317 w:1601 (right-bleed, ~83.4% width).
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
            src="/images/tailored-tray.jpg"
            alt="Two pairs of hands lifting savoury tartlets from a scalloped metal tray on a dark wooden table."
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

      {/* _Q3A2026 1 (Figma 3:1642) — wide plated-dish band under the row, right-bleed
          at ~83.4% width to match the design. Spans both columns on its own row, with
          extra top margin so it sits clearly below the image/text row above it. */}
      <div className="mt-[clamp(2rem,5vw,5rem)] md:order-3 md:col-span-2">
        <div className="w-full md:ml-auto md:w-[83.4%]">
          <Reveal className="w-full">
            <Image
              src="/images/plated-dish.jpg"
              alt="A plated main course on a red-rimmed cream plate — seared beef medallions with a prawn, a mound of saffron rice topped with crispy leek, and a smear of pink sauce — set on a linen tablecloth."
              width={1601}
              height={1049}
              sizes="(max-width: 768px) 100vw, 83vw"
              className="h-auto w-full object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
