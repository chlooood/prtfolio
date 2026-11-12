import { Built } from "@/components/Built";
import { Contact } from "@/components/Contact";
import { Dusk } from "@/components/Dusk";
import { Hero } from "@/components/Hero";
import { MotionRoot } from "@/components/MotionRoot";
import { Nav } from "@/components/Nav";
import { OffClock } from "@/components/OffClock";
import { Premise } from "@/components/Premise";
import { Read } from "@/components/Read";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Premise />
        <Built />
        <Dusk />
        <Read />
        <OffClock />
      </main>
      <Contact />
      {/* Last, so its ScrollTriggers are created after every section's. */}
      <MotionRoot />
    </>
  );
}
