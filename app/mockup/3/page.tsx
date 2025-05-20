"use client";
import Navbar from "./Components/Navbar";
import HeroSection from "./Sections/HeroSection";
import StepsSection from "./Sections/StepsSection";
import FeaturesSection from "./Sections/FeaturesSection";
import IndustriesSection from "./Sections/IndustriesSection";
import BlogSection from "./Sections/BlogSection";
import PricingSection from "./Sections/PricingSection";
import FAQSection from "./Sections/FAQSection";
import CTASection from "./Sections/CTASection";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  return (
    <div
      className={`flex min-h-screen flex-col ${inter.className}`}
      style={{
        backgroundColor: "hsl(0, 0%, 100%)",
        color: "hsl(20, 10%, 15%)",
      }}
    >
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <StepsSection />

        <FeaturesSection />

        <IndustriesSection />

        <BlogSection />

        <PricingSection />

        <FAQSection />

        <CTASection />
      </main>
    </div>
  );
}
