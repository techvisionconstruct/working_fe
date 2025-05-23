"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/shared";
import { useRouter } from "next/navigation";
import { PopupModal } from "react-calendly";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleCalendly = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.Calendly) {
      window.Calendly.initPopupWidget({
        url: "https://calendly.com/avorino/simple-projex-demo",
      });
    } else {
      window.open("https://calendly.com/avorino/simple-projex-demo", "_blank");
    }
  };

  return (
    <>
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
        <div className="container flex h-20 items-center justify-between px-6 md:px-12 mx-auto">
          <Link href="/" className="flex items-center gap-2 z-10">
            <Image
              src="https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/latest-logo.png"
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

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 z-10">
            {["Features", "Industries", "Blog", "Pricing", "FAQ"].map(
              (text) => (
                <Link
                  key={text}
                  href={`#${text}`}
                  className={`text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {text}
                </Link>
              )
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4 z-10">
            <Button
              variant="ghost"
              className={
                scrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10"
              }
              onClick={() => router.replace("/signin")}
            >
              Sign in
            </Button>
            <Button
              className={
                scrolled
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white text-primary hover:bg-white/90"
              }
              style={{
                backgroundColor: scrolled ? "hsl(0, 85%, 30%)" : "white",
                color: scrolled ? "white" : "hsl(0, 85%, 30%)",
              }}
              onClick={() => setCalendlyOpen(true)}
            >
              Schedule a demo
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden z-20 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Menu</span>
          </Button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 z-40 w-full bg-white text-black px-6 py-4 flex flex-col gap-4 border-t border-gray-200 shadow-md">
            {["Features", "Industries", "Blog", "Pricing", "FAQ"].map(
              (text) => (
                <Link
                  key={text}
                  href={`#${text}`}
                  className="text-base font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {text}
                </Link>
              )
            )}
            <Button
              variant="ghost"
              className="text-black"
              onClick={() => {
                setMenuOpen(false);
                router.replace("/signin");
              }}
            >
              Sign in
            </Button>
            <Button
              className="bg-red-700 text-white hover:bg-red-800"
              onClick={(e) => {
                handleCalendly(e);
                setMenuOpen(false);
              }}
            >
              Schedule a demo
            </Button>
          </div>
        )}
      </header>

      {typeof window !== "undefined" && (
        <PopupModal
          url="https://calendly.com/avorino/simple-projex-demo"
          open={calendlyOpen}
          onModalClose={() => setCalendlyOpen(false)}
          rootElement={document.body}
        />
      )}
    </>
  );
}
