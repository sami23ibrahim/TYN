import { ReactNode } from "react";

/**
 * Centered content wrapper. Caps width at the 1920px artboard and applies the
 * side gutter (~113px @1920, fluid down to 20px on mobile) defined in globals.css.
 */
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[120rem] px-[var(--gutter)] ${className}`}>
      {children}
    </div>
  );
}
