"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal — a mask wipe (clip-path opening top→bottom) plus a subtle
 * zoom-out, fired ONCE when the element scrolls into view. The motion lives in
 * globals.css (.reveal states); this arms and triggers it.
 *
 * Trigger: a scroll/resize listener + getBoundingClientRect (reliable everywhere),
 * NOT IntersectionObserver. A safety timeout guarantees the image is revealed even
 * if scroll events never arrive — so an image can never get stuck hidden.
 *
 * SSR / no-JS safe: children render fully visible by default; the hidden state is
 * applied only on the client, and only to elements below the fold at mount (so
 * above-the-fold images never flash). Honors prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const inView = () => {
      const r = el.getBoundingClientRect();
      // Reveal once the element's top rises above 82% of the viewport (and it
      // hasn't already scrolled past the top).
      return r.top < window.innerHeight * 0.82 && r.bottom > 0;
    };

    // Already visible at mount → leave it, don't animate.
    if (inView()) return;

    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    el.dataset.reveal = "hidden";

    let raf = 0;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      el.dataset.reveal = "shown";
      cleanup();
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (inView()) reveal();
      });
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(safety);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Safety net: if scroll events never fire for any reason, reveal anyway so
    // the image is never left hidden.
    const safety = setTimeout(reveal, 5000);
    onScroll(); // check immediately in case we mount already near the fold

    return cleanup;
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
