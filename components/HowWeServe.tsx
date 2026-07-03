import Image from "next/image";
import Container from "@/components/ui/Container";
import ServiceItem from "@/components/ui/ServiceItem";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/**
 * How We Serve — centered heading, two service descriptions, then an asymmetric image
 * pair (large left-bleed tray + smaller bottom-right plate) and a centered "Our menu" pill.
 * Design @1920: heading centered top:5441; columns left:108 w:806 / left:1011 w:800;
 * big image left:0 w:1128 (58.75%); small image left:1404 w:355 (18.5%), bottom-aligned.
 */
export default function HowWeServe() {
  return (
    <section id="how-we-serve" className="py-[clamp(3rem,7vw,7rem)] text-wine">
      <Container>
        <h2 className="text-center text-h2 text-wine">How We Serve</h2>

        <div className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-x-[clamp(2rem,5.4vw,6.5rem)] gap-y-10 md:grid-cols-2">
          <ServiceItem title="The Convivial Buffet">
            A generous spread laid out for guests to graze freely, dishes
            replenished throughout the service. All items are presented in
            communal serving vessels, encouraging the convivial spirit of a
            Levantine table. Perfect for dynamic corporate events, launches, and
            social gatherings.
          </ServiceItem>
          <ServiceItem title="The Mezze-Style Dinner">
            A curated selection of dishes brought to the table in waves, designed
            to be shared. The pace is unhurried, the portions generous, and the
            intention is for guests to linger. Ideal for intimate private
            dinners, celebrations, and formal sit-down gatherings.
          </ServiceItem>
        </div>
      </Container>

      {/* Asymmetric image pair: large tray (left-bleed, 58.75%) + small plate (bottom-right, 18.5%) */}
      <div className="relative mt-[clamp(2.5rem,6vw,6rem)]">
        <div className="w-full md:w-[58.75%]">
          <Reveal className="w-full">
            <Image
              src="/images/serve-tray.jpg"
              alt="Guests reaching across a candlelit table laden with mezze — hummus, muhammara, stuffed vine leaves, falafel and saffron rice."
              width={1128}
              height={721}
              sizes="(max-width: 768px) 100vw, 59vw"
              className="h-auto w-full object-cover"
            />
          </Reveal>
        </div>
        <div className="mt-8 w-[56%] px-[var(--gutter)] md:absolute md:bottom-0 md:right-[8.4%] md:mt-0 md:w-[18.5%] md:px-0">
          <Reveal className="w-full" delay={140}>
            <Image
              src="/images/serve-plate.jpg"
              alt="A dark wooden bowl of jewelled tabbouleh studded with pomegranate seeds."
              width={355}
              height={476}
              sizes="(max-width: 768px) 56vw, 18.5vw"
              className="h-auto w-full object-cover"
            />
          </Reveal>
        </div>
      </div>

      <div className="mt-[clamp(2.5rem,5vw,5rem)] flex justify-center">
        {/* // TODO: point at the real menu page/PDF when available */}
        <Button href="#tailored">Our menu</Button>
      </div>
    </section>
  );
}
