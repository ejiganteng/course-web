"use client";
import HeroLand from "../components/landing/hero";
import NavbarLand from "../components/landing/navbar";
import { motion, useScroll } from "framer-motion";
import FooterLand from "../components/landing/footer";
import KosonganLand from "../components/landing/course";
import StatsSection from "@/components/landing/stats";

export default function ScrollLinked() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          originX: 0,
          height: 5,
        }}
        className="fixed top-0 left-0 right-0 bg-purple-500 z-50"
      />

      <LandingPage />
    </>
  );
}

function LandingPage() {

  return (
    <div className="min-h-screen text-black">
      <NavbarLand />
      <HeroLand />
      <StatsSection/>
      <KosonganLand/>
      <FooterLand/>
    </div>
  );
}
