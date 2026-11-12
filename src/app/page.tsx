import { Built } from "@/components/Built";
import { Contact } from "@/components/Contact";
import { Errata } from "@/components/Errata";
import { Hero } from "@/components/Hero";
import { MotionRoot } from "@/components/MotionRoot";
import { Nav } from "@/components/Nav";
import { OffClock } from "@/components/OffClock";
import { Premise } from "@/components/Premise";
import { Read } from "@/components/Read";
import { Worked } from "@/components/Worked";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Premise />
        <Built />
        <Worked />
        <Read />
        <OffClock />
        <Errata />
      </main>
      <Contact />
      {/* Last, so its ScrollTriggers are created after every section's. */}
      <MotionRoot />
    </>
  );
}
