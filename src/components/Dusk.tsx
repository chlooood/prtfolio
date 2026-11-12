import { Landscape } from "./Landscape";

/**
 * An interlude with no words to read: the hero's view again, later in the day.
 * Morning opens the page, this is the middle, night closes it.
 */
export function Dusk() {
  return (
    <figure className="pb-[clamp(4rem,9vw,8rem)]">
      <Landscape phase="dusk" className="block h-[clamp(20rem,58vw,44rem)] w-full" />
      <figcaption className="label mt-3 flex justify-between px-[var(--pad)] text-muted">
        <span>Plate II</span>
        <span>The same view, later</span>
      </figcaption>
    </figure>
  );
}
