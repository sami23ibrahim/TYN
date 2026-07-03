"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Horizontal-scroll image strip for the Tailored Concepts section. On desktop the strip
 * PINS to the viewport when it's reached and vertical scroll advances it right→left,
 * bringing the next photo into view before the page continues down. All photos are the
 * same size.
 *
 * Progressively enhanced (same scroll/rAF pattern as ui/Reveal.tsx):
 *   - SSR / no-JS / mobile (<768px) / prefers-reduced-motion → photos simply stack.
 *   - JS on, ≥768px, motion allowed → pinned horizontal scroll kicks in on mount.
 */

const IMAGES = [
  {
    src: "/images/tailored-knafeh.jpg",
    alt: "Two hands pulling apart a warm knafeh over a stone bowl of crushed pistachios.",
  },
  {
    src: "/images/tailored-tray.jpg",
    alt: "Two pairs of hands lifting savoury tartlets from a scalloped tray on a dark table.",
  },
];

export default function HorizontalConcepts() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  // Decide pinned vs. stacked from viewport width + motion preference. Kept separate so
  // the measure/scroll effect below re-runs cleanly whenever `pinned` flips.
  useEffect(() => {
    const mqWidth = window.matchMedia("(min-width: 768px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setPinned(mqWidth.matches && !mqMotion.matches);
    decide();
    mqWidth.addEventListener("change", decide);
    mqMotion.addEventListener("change", decide);
    return () => {
      mqWidth.removeEventListener("change", decide);
      mqMotion.removeEventListener("change", decide);
    };
  }, []);

  // Drive the horizontal translate. Keyed on `pinned` so it runs AFTER the flex-row layout
  // has committed — measuring the stacked layout would report zero overflow and the track
  // would never move.
  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    if (!pinned) {
      track.style.transform = "";
      wrap.style.height = "";
      return;
    }

    let raf = 0;
    let overflow = 0;

    // Tall wrapper = viewport + horizontal overflow, so vertical scroll ≈ horizontal travel.
    // Height is set imperatively (DOM-syncing, not React state) to avoid re-render churn.
    const measure = () => {
      overflow = Math.max(track.scrollWidth - window.innerWidth, 0);
      wrap.style.height = `${window.innerHeight + overflow}px`;
    };

    const update = () => {
      if (overflow <= 0) {
        track.style.transform = "";
        return;
      }
      const total = wrap.offsetHeight - window.innerHeight;
      const progress =
        total > 0
          ? Math.min(Math.max(-wrap.getBoundingClientRect().top / total, 0), 1)
          : 0;
      track.style.transform = `translate3d(${-progress * overflow}px, 0, 0)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned]);

  return (
    <div ref={wrapRef} className={pinned ? "relative" : ""}>
      <div
        className={
          pinned ? "sticky top-0 flex h-screen items-center overflow-hidden" : ""
        }
      >
        <div
          ref={trackRef}
          className={
            pinned
              ? "flex will-change-transform"
              : "flex flex-col gap-[clamp(2rem,4vw,3.5rem)] px-[clamp(1.25rem,7.7vw,9.25rem)]"
          }
        >
          {IMAGES.map((img) => (
            // Pinned: each photo sits in its own full-screen-width slide, so the next photo
            // starts entirely off the right edge until you scroll to it. All photos same size.
            <div
              key={img.src}
              className={
                pinned
                  ? "flex w-screen shrink-0 items-center justify-center px-[var(--gutter)]"
                  : ""
              }
            >
              <div className="relative aspect-[3/2] w-full max-w-[1040px] overflow-hidden rounded-[2px]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
