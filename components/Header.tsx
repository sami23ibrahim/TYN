"use client";

import { useState } from "react";

// Nav from the export (left→right). Events / Our Food / Gallery have no dedicated
// section in this one-pager, so they point at the nearest relevant anchor.
// // TODO: confirm intended targets (or add the sections) when the sitemap is final.
const NAV = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#tailored" },
  { label: "Our Food", href: "#how-we-serve" },
  { label: "Gallery", href: "#philosophy" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      id="top"
      className="relative z-50 bg-cream px-[clamp(1.25rem,3.125vw,3.75rem)]"
    >
      {/* py 12px @1920 (was 16 ← 26 ← 36px) — header band tightened again at client
          request to cut the white space above/below the nav */}
      <div className="flex items-center justify-between py-[clamp(0.375rem,0.625vw,0.75rem)]">
        {/* Logo — burgundy SVG. The width/height attrs are the asset's true viewBox
            (193×83) and describe the file, not the render; the clamp draws it 54px
            tall @1920, i.e. ~126×54. Figma node 3:1602 has it at 83px; it has been
            stepped down (83 → 71 → 54) because the logo, not the padding, is what
            sets the header band height. */}
        <a href="#top" aria-label="TÝN — home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-tyn.svg"
            alt="TÝN"
            width={193}
            height={83}
            className="h-[clamp(1.625rem,2.8125vw,3.375rem)] w-auto"
          />
        </a>

        {/* Desktop nav — 30px burgundy, ~100px gaps, right-aligned cluster */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-[clamp(1.5rem,5.2vw,6.25rem)]">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-nav text-wine transition-opacity duration-200 hover:opacity-60"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-wine md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="pb-6 md:hidden">
          <ul className="flex flex-col gap-5">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-nav text-wine"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
