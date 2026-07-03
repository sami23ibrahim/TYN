import { ReactNode } from "react";

/**
 * Sub-heading + paragraph block. Reused in How We Serve and the Tailored Concepts
 * services grid. Colour is inherited from the parent section (wine or oxblood), so the
 * same component reads correctly on both the cream and the blush panels.
 */
export default function ServiceItem({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-h3">{title}</h3>
      <p className="mt-[clamp(0.75rem,1.4vw,1.375rem)] text-body">{children}</p>
    </div>
  );
}
