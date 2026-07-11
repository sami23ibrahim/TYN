"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * Tailored Concepts gallery — a click-through slideshow. One 3:2 photo shows at a
 * time inside a fixed frame; the ‹ › chevrons (oxblood, matching Figma "Vector 1")
 * flank the frame and slide the next/previous photo in. It loops, so both arrows
 * stay live. Replaces the earlier scroll-pinned horizontal strip.
 *
 * Slide #1 is the original knafeh photo we kept; #2–#7 are the updated design's
 * images (public/images/tailored-2…7.png).
 *
 * Progressive/accessible:
 *   - prefers-reduced-motion → the slide change is instant (no transform easing).
 *   - Buttons carry aria-labels; a polite live region announces the position.
 *   - Current + immediate neighbours are eager-loaded so navigation doesn't flash;
 *     the rest lazy-load. No-JS shows the first slide (JS drives the controls).
 */

const IMAGES = [
  {
    src: "/images/tailored-knafeh.jpg",
    alt: "Two hands pulling apart a warm knafeh over a stone bowl of crushed pistachios.",
  },
  {
    src: "/images/tailored-2.png",
    alt: "A crisp golden pastry roll on a rustic red plate, drizzled with pomegranate molasses and served with labneh and pickled chilli.",
  },
  {
    src: "/images/tailored-3.png",
    alt: "An overhead spread of four mezze dips — hummus, muhammara and labneh — garnished with olives, pomegranate and black sesame on a linen cloth.",
  },
  {
    src: "/images/tailored-4.png",
    alt: "Fried kibbeh resting on a swoosh of yogurt, one halved to reveal its spiced filling, garnished with fresh mint.",
  },
  {
    src: "/images/tailored-5.png",
    alt: "A generous wooden bowl of tabbouleh studded with pomegranate seeds, bulgur and finely chopped parsley.",
  },
  {
    src: "/images/tailored-6.png",
    alt: "A square of semolina cake topped with cream quenelles and crushed pistachio, finished with a pour of honey syrup, on a mint-green plate.",
  },
  {
    src: "/images/tailored-7.png",
    alt: "Three golden croquettes lined up on a pressed-glass tray, topped with labneh, black sesame and chilli jam.",
  },
];

/** Thin caret matching the Figma "Vector 1" chevron. Colour inherits (currentColor). */
function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[clamp(1.75rem,3.6vw,2.75rem)] w-auto"
    >
      <polyline points={dir === "left" ? "17,3 5,22 17,41" : "7,3 19,22 7,41"} />
    </svg>
  );
}

export default function HorizontalConcepts() {
  const count = IMAGES.length;
  const [index, setIndex] = useState(0);
  const [motionOK, setMotionOK] = useState(false);
  // Which slides may load immediately. Seed with the first slide + its two
  // neighbours (wrapping) so the opening navigation in either direction is warm.
  const [eager, setEager] = useState<Set<number>>(
    () => new Set([0, 1, count - 1]),
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOK(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go = (to: number) => {
    const next = (to + count) % count;
    setIndex(next);
    setEager((prev) =>
      new Set(prev)
        .add(next)
        .add((next + 1) % count)
        .add((next - 1 + count) % count),
    );
  };

  return (
    <Reveal className="w-full">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Tailored concepts gallery"
        className="relative mx-auto flex w-full max-w-[1360px] items-center justify-center gap-[clamp(0.5rem,2.2vw,2.25rem)] px-[var(--gutter)] text-oxblood"
      >
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous image"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-oxblood transition-opacity duration-200 hover:opacity-60"
        >
          <Chevron dir="left" />
        </button>

        {/* Viewport — clips to one slide; the track slides by whole frames. */}
        <div className="relative aspect-[3/2] w-full max-w-[1040px] overflow-hidden rounded-[2px]">
          <div
            className="flex h-full"
            style={{
              transform: `translate3d(-${index * 100}%, 0, 0)`,
              transition: motionOK
                ? "transform 600ms cubic-bezier(0.33, 0.4, 0.3, 1)"
                : "none",
            }}
          >
            {IMAGES.map((img, i) => (
              <div
                key={img.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== index}
                className="relative h-full w-full shrink-0"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  loading={eager.has(i) ? "eager" : "lazy"}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next image"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-oxblood transition-opacity duration-200 hover:opacity-60"
        >
          <Chevron dir="right" />
        </button>

        <p className="sr-only" aria-live="polite">
          Image {index + 1} of {count}
        </p>
      </div>
    </Reveal>
  );
}
