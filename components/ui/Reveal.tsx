"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal — a mask wipe (clip-path opening top→bottom) plus a subtle
 * zoom-out, fired ONCE when the element scrolls into view. The motion lives in
 * globals.css (.reveal states); this arms and triggers it.
 *
 * Trigger: IntersectionObserver with the root's bottom edge pulled up 18%, so an
 * image begins its wipe as its top rises past 82% of the viewport.
 *
 * DO NOT reintroduce a blanket setTimeout fallback here. An earlier version revealed
 * every instance 5s after mount as a "never get stuck hidden" safety net. Every Reveal
 * on this one-pager mounts at page load, so that fired for the whole page at once and
 * each below-the-fold image played its animation off-screen — leaving only the first
 * image you reached looking animated, and every later one already open on arrival.
 * IO needs no such net: it does not depend on scroll events and re-evaluates on resize
 * and layout shift too.
 *
 * SSR / no-JS safe: children render fully visible by default. The hidden state is
 * applied only on the client, and only to elements still below the trigger line at
 * mount — so above-the-fold images (the hero) and, on a mid-page refresh, images
 * already scrolled past are both left alone and never flash. Honors
 * prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "image",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** "image" = clip wipe + zoom. "text" = fade + short rise (see .reveal-text). */
  variant?: "image" | "text";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // No IO available → leave everything visible rather than risk hiding it for good.
    if (typeof IntersectionObserver === "undefined") return;

    // Already at or above the trigger line at mount → leave as-is, don't animate.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.82) return;

    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    el.dataset.reveal = "hidden";

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        el.dataset.reveal = "shown";
        io.disconnect(); // once only — no replay when scrolling back up
      },
      // Matches the previous 0.82 * innerHeight trigger point.
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);

    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${variant === "text" ? "reveal-text" : "reveal"} ${className}`}
    >
      {children}
    </div>
  );
}
