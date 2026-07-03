import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/**
 * Intro — H1 (left, 42px) + supporting lede (right, 24px, top-aligned) + "Contact us"
 * pill, then the left-bleed vase/figs image. Widths measured from the export @1920:
 * H1 frame left:109 w:669, lede left:856 w:727; vase image left:-2 w:1289 (67.1%).
 */
export default function Intro() {
  return (
    <section className="pt-[clamp(2.5rem,5vw,6rem)] pb-[clamp(4rem,9vw,9.5rem)]">
      <Container>
        {/* Track sizes encode the exact design widths: 669 H1 : 78 gap : 727 lede : 228 right space */}
        <div className="grid items-start gap-y-9 md:[grid-template-columns:669fr_78fr_727fr_228fr]">
          <div className="md:col-start-1">
            <h1 className="text-display text-wine">
              Premium catering crafted with
              <br className="hidden md:block" />
              a touch of Middle Eastern heritage.
            </h1>
            <Button href="#contact" className="mt-[clamp(1.75rem,3vw,2.75rem)]">
              Contact us
            </Button>
          </div>

          <div className="md:col-start-3">
            <p className="text-body text-wine">
              Thoughtfully designed menus, seasonal ingredients, and memorable
              experiences for weddings, private celebrations
              <br className="hidden md:block" />
              and corporate events.
            </p>
          </div>
        </div>
      </Container>

      {/* Vase/figs — left-bleed image (touches the left viewport edge). @1920: w1289 (67.1%). */}
      <div className="mt-[clamp(2.5rem,10.7vw,12.875rem)] w-[88%] max-w-[1289px] md:w-[67.1%]">
        <Reveal className="w-full">
          <Image
            src="/images/vase-figs.jpg"
            alt="A footed red ceramic bowl holding fresh whole and halved green figs on a soft neutral background."
            width={1289}
            height={859}
            sizes="(max-width: 768px) 88vw, 67vw"
            className="h-auto w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
