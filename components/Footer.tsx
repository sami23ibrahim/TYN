import ContactForm from "@/components/ContactForm";

const linkCls = "underline-offset-4 hover:underline focus-visible:outline-cream";

/**
 * Footer — wine (#7e283e) panel, cream text. "Get in touch with us." (42px) top-left,
 * then a single info@tynkitchen.cz contact, with ig + copyright stacked below (all 24px).
 * The right half is an outlined box.
 *
 * Design @1920 (node 27:4): heading top:10972; info@ top:11049; ig top:11149;
 * copyright top:11461. Outlined box (white border) left:999 w:832 h:588 top:10945.
 *
 * NOTE: in Figma the right box is EMPTY (a design placeholder). We keep a working contact
 * form inside it so the footer is functional — flagged as a deliberate deviation from 1:1.
 */
export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-wine text-cream px-[clamp(1.25rem,8.39vw,10.0625rem)] pt-[clamp(2.5rem,7.14vw,8.5625rem)] pb-[clamp(2.5rem,5.4vw,6.5rem)]"
    >
      <div className="grid gap-y-12 md:grid-cols-2 md:items-start md:gap-x-[clamp(2rem,4vw,5rem)]">
        {/* Left: heading (top) + contacts / copyright (bottom) */}
        <div className="flex flex-col">
          <h2 className="text-h2">
            Get in touch
            <br />
            with us.
          </h2>

          <div className="mt-[clamp(2.5rem,7vw,11rem)]">
            <p className="text-body">
              <a href="mailto:info@tynkitchen.cz" className={linkCls}>
                info@tynkitchen.cz
              </a>
            </p>

            <p className="mt-[clamp(1.5rem,2.5vw,2.75rem)] text-body">
              <a
                href="https://instagram.com/tynkitchen"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                ig @tynkitchen
              </a>
            </p>

            <p className="mt-[clamp(1.5rem,2vw,2.5rem)] text-body">
              Copyright Týn and Thyme catering s. r. o.
            </p>
          </div>
        </div>

        {/* Right: outlined box (Figma shows it empty; holds the contact form here) */}
        <div className="rounded-[2px] border border-cream p-[clamp(1.5rem,3vw,2.5rem)] md:min-h-[clamp(20rem,30.6vw,36.75rem)]">
          <ContactForm />
        </div>
      </div>
    </footer>
  );
}
