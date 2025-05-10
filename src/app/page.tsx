"use client";
import HeroLand from "./components/landing/hero";
import NavbarLand from "./components/landing/navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-black">
      <NavbarLand />
      <HeroLand />
    </div>
  );
}