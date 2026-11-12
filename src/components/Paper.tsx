import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * A scrap of cut paper laid on the map. `tilt` is in degrees — nothing in a
 * collage sits perfectly square. `sheet` recolours the scrap.
 */
export function Paper({
  as: Tag = "div",
  tilt = 0,
  sheet,
  flat = false,
  className = "",
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  tilt?: number;
  sheet?: string;
  flat?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const merged = {
    rotate: tilt ? `${tilt}deg` : undefined,
    ...(sheet ? { ["--sheet"]: sheet } : {}),
    ...style,
  } as CSSProperties;
  return (
    <Tag className={`paper ${flat ? "paper-flat" : ""} ${className}`} style={merged} {...rest}>
      {children}
    </Tag>
  );
}

/** The header each section's sheet opens with: a place-name and a title. */
export function SheetHead({
  place,
  title,
  tally,
}: {
  place: string;
  title: ReactNode;
  tally?: string;
}) {
  return (
    <header>
      <p className="label flex items-baseline justify-between gap-4 text-muted">
        <span>{place}</span>
        {tally && <span>{tally}</span>}
      </p>
      <h2 className="display mt-4 text-[clamp(3.75rem,13vw,12rem)] text-ink">{title}</h2>
    </header>
  );
}
