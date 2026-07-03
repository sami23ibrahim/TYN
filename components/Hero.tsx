import Image from "next/image";

/**
 * Full-bleed hero photograph (the Levantine mezze spread). The headline lives in
 * the Intro section below it, matching the export (no text overlay on the image).
 */
export default function Hero() {
  return (
    <section aria-label="A Levantine mezze spread">
      <Image
        src="/images/hero-mezze.jpg"
        alt="An overhead spread of Levantine mezze — hummus, tabbouleh, muhammara, fatteh, fresh salads, savoury pastries and figs laid across a striped linen tablecloth."
        width={1920}
        height={1152}
        priority
        sizes="100vw"
        // Design: 1920×1152 (exact 5:3). Lock the box to that ratio so it can't
        // drift with the comp slice's pixel count; object-cover fills it.
        className="aspect-[1920/1152] w-full object-cover"
      />
    </section>
  );
}
