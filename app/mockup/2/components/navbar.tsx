"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/shared";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 text-foreground"
          : "bg-transparent text-white"
      }`}
      style={{
        borderColor: scrolled ? "hsla(20, 10%, 90%, 0.4)" : "transparent",
      }}
    >
      <div className="container flex h-17 items-center justify-between mx-auto p-4 md:p-8">
        <Link href="/" className="flex items-center gap-2 z-10">
          <Image
            src="https://i.ibb.co/LXR9NfMr/logo.png"
            alt="Simple ProjeX"
            width={40}
            height={40}
            className={scrolled ? "" : "invert"}
            priority
            loading="eager"
            style={{ height: "auto" }}
          />
          <span className="font-bold text-xl">Simple ProjeX</span>
        </Link>

        <nav className="hidden md:flex gap-6 z-10">
          <Link
            href="#features"
            className={`text-sm font-medium transition-colors ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/80 hover:text-white"
            }`}
          >
            Features
          </Link>
          <Link
            href="#industries"
            className={`text-sm font-medium transition-colors ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/80 hover:text-white"
            }`}
          >
            Industries
          </Link>
          <Link
            href="#pricing"
            className={`text-sm font-medium transition-colors ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/80 hover:text-white"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className={`text-sm font-medium transition-colors ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/80 hover:text-white"
            }`}
          >
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center gap-4 z-10">
          <Button
            variant="ghost"
            className={`hidden md:inline-flex ${
              scrolled
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => router.push("/signin")}
          >
            Sign in
          </Button>
          <Button
            className={`hidden md:inline-flex ${
              scrolled
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white text-primary hover:bg-white/90"
            }`}
            style={{
              backgroundColor: scrolled ? "hsl(0, 85%, 30%)" : "white",
              color: scrolled ? "white" : "hsl(0, 85%, 30%)",
            }}
          >
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-7 w-7" />
            <span className="sr-only">Close menu</span>
          </Button>
          <nav className="flex flex-col gap-8 items-center">
            <Link
              href="#features"
              className="text-lg font-medium text-white hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#industries"
              className="text-lg font-medium text-white hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Industries
            </Link>
            <Link
              href="#pricing"
              className="text-lg font-medium text-white hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-lg font-medium text-white hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Testimonials
            </Link>
            <div className="flex flex-col gap-4 mt-8 w-full items-center">
              <Button
                variant="ghost"
                className="text-white w-40"
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/signin");
                }}
              >
                Sign in
              </Button>
              <Button
                className="bg-primary text-white w-40"
                style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
