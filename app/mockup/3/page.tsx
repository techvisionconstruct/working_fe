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
import React from "react";
import Link from "next/link";
import Image from "next/image";

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
      <footer
        className="pt-20 pb-10"
        style={{
          backgroundColor: "hsl(20, 10%, 15%)",
          color: "hsl(0, 0%, 100%)",
        }}
      >
        <div className="container px-4 mx-auto">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-16">
            <div className="col-span-1 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <Image
                  src="https://i.ibb.co/LXR9NfMr/logo.png"
                  alt="Simple ProjeX"
                  width={40}
                  height={40}
                  className="invert"
                  loading="lazy"
                />
                <span className="font-bold text-2xl">Simple ProjeX</span>
              </Link>
              <p
                className="mb-8 max-w-md"
                style={{ color: "hsl(20, 10%, 70%)" }}
              >
                Professional proposal software designed specifically for
                construction industry professionals to win more projects.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Footer links with updated styling */}
            <div>
              <h3 className="font-bold text-lg mb-6">Product</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#industries"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Industries
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors"
                    style={{ color: "hsl(20, 10%, 70%)" }}
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col sm:flex-row justify-between items-center"
            style={{
              borderTopColor: "hsl(20, 10%, 25%)",
              borderTopWidth: "1px",
            }}
          >
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Simple ProjeX. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link
                href="#"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
