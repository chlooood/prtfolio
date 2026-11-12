import { Boats } from "@/components/Boats";
import { Built } from "@/components/Built";
import { Contact } from "@/components/Contact";
import { Exchange } from "@/components/Exchange";
import { Hero } from "@/components/Hero";
import { MotionRoot } from "@/components/MotionRoot";
import { Nav } from "@/components/Nav";
import { OffClock } from "@/components/OffClock";
import { Premise } from "@/components/Premise";
import { Read } from "@/components/Read";
import { RiverMap } from "@/components/RiverMap";
import { Sun } from "@/components/Sun";

/* Layers, back to front: the map · the boats · the paper · the sun · the nav tags. */
export default function Home() {
  return (
    <>
      <RiverMap />
      <Boats />
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <Premise />
        <Built />
        <Read />
        <Exchange />
        <OffClock />
      </main>
      <Contact />
      <Sun />
      {/* Last, so its ScrollTriggers are created after every section's. */}
      <MotionRoot />
    </>
  );
}
