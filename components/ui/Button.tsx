import { ReactNode } from "react";

/**
 * Outlined pill button from the export (Contact us / Our menu): thin wine border,
 * transparent fill, wine label, 11px radius, ~63px tall @1920 with a 40px label.
 * Renders an <a> when `href` is given, otherwise a <button>.
 * // Hover state (fill on hover) is a sensible assumption — the flat export has no states.
 */
export default function Button({
  children,
  href,
  type = "button",
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}) {
  const cls =
    "inline-flex items-center justify-center rounded-[11px] border border-wine text-btn leading-none text-wine " +
    "px-[clamp(0.9rem,1.15vw,1.4rem)] py-[clamp(0.5rem,0.6vw,0.72rem)] " +
    "transition-colors duration-200 hover:bg-wine hover:text-cream " +
    className;

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}
