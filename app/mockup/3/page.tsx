"use client";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HeroSection from "./Sections/HeroSection";
import StepsSection from "./Sections/StepsSection";
import FeaturesSection from "./Sections/FeaturesSection";
import IndustriesSection from "./Sections/IndustriesSection";
import BlogSection from "./Sections/BlogSection";
import PricingSection from "./Sections/PricingSection";
import FAQSection from "./Sections/FAQSection";
import CTASection from "./Sections/CTASection";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  return (
    <div
      className={`${inter.className} relative`}
      style={{
        backgroundColor: "hsl(0, 0%, 100%)",
        color: "hsl(20, 10%, 15%)",
      }}
    >
      <Navbar />
      <main className="">
        <HeroSection />
        <StepsSection />
        <FeaturesSection />
        <IndustriesSection />
        <BlogSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
