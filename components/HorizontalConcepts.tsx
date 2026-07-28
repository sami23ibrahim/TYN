"use client";

import { useEffect, useRef, useState } from "react";
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
 * On touch devices the frame is also swipeable: the track follows the finger and
 * settles to the next/previous slide past a threshold (see the pointer handlers).
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

  // ── Swipe ────────────────────────────────────────────────────────────────
  // Pointer events, so touch and pen (and a mouse drag) all work with one path.
  // The gesture stays undecided until it clears an 8px slop radius, then locks to
  // an axis: horizontal drags the track, vertical is released back to the page so
  // the section still scrolls normally (`touch-pan-y` on the viewport tells the
  // browser the same thing, which is what keeps scrolling smooth on iOS).
  const viewportRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    axis: "undecided" | "x" | "y";
    width: number;
  } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    gesture.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      axis: "undecided",
      width: viewportRef.current?.clientWidth || 1,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;

    if (g.axis === "undecided") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      g.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (g.axis !== "x") return;
      // Capture so the drag survives the finger leaving the frame.
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    if (g.axis !== "x") return;
    setDragX(dx);
  };

  // Settle: past the threshold we advance, otherwise the track springs back. Both
  // are the same animation — dragging goes false, so the transition is live again.
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    setDragging(false);
    setDragX(0);
    if (g.axis !== "x") return;
    const dx = e.clientX - g.x;
    const threshold = Math.max(40, g.width * 0.15);
    if (dx <= -threshold) go(index + 1);
    else if (dx >= threshold) go(index - 1);
  };

  const onPointerCancel = () => {
    gesture.current = null;
    setDragging(false);
    setDragX(0);
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
        <div
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          className="relative aspect-[3/2] w-full max-w-[1040px] touch-pan-y overflow-hidden rounded-[2px] select-none"
        >
          <div
            className="flex h-full"
            style={{
              transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)`,
              // No easing mid-drag — the track must track the finger 1:1.
              transition:
                motionOK && !dragging
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
                  // Without this a mouse drag grabs the image's native ghost instead.
                  draggable={false}
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
