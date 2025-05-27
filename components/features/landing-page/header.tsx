"use client";

import { Mail, MapPin, Menu, Lightbulb, Plug } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({
  theme,
  toggleTheme,
  toggleMobileMenu,
  isMobileMenuOpen,
}: HeaderProps) {
  const [scrolling, setScrolling] = useState(false);
  const router = useRouter();

  // Simplified scroll handler - no preloading needed for SVG
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full transition-all duration-500 z-20 px-4 ${
        scrolling ? "py-2 shadow-md" : "py-4"
      } ${
        scrolling
          ? "bg-background border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Left Side: Logo - Using SVG for better performance */}
        <div className="flex items-center">
          <div
            className={`transition-all duration-300 flex items-center ${
              scrolling ? "h-16" : "h-28"
            }`}
          >
            <Link href="/">
              <div className={`transition-all duration-300 relative ${
                scrolling ? "w-[120px] h-12" : "w-[240px] h-16"
              }`}>
                <img
                  src="/icons/logo.svg"
                  alt="Simple Projex Logo"
                  className={`transition-all duration-300 w-full h-full ${
                    scrolling ? "filter-none" : "filter-white"
                  }`}
                  style={{ 
                    filter: scrolling ? 'invert(0%)' : 'invert(100%)'
                  }}
                />
              </div>
            </Link>
          </div>
        </div>
        
        {/* Right Side: Single row for contact info, theme toggle, and login */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Contact Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <Mail className={`w-5 h-5 ${scrolling ? "text-foreground" : "text-white"} transition-all`} />
              <span className={`text-sm ${scrolling ? "text-foreground" : "text-white"}`}>build@simpleprojex.com</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className={`w-5 h-5 ${scrolling ? "text-foreground" : "text-white"} transition-all`} />
              <span className={`text-sm ${scrolling ? "text-foreground" : "text-white"}`}>Irvine, California</span>
            </div>
          </div>
          
          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className="w-16 h-8 rounded-full border border-border bg-muted/80 p-1 flex items-center transition-all duration-300 hover:bg-accent focus:outline-none"
            aria-label="Toggle Theme"
          >
            <div
              className={`w-6 h-6 bg-background rounded-full shadow-md transition-all duration-300 transform ${
                theme === "light" ? "translate-x-0" : "translate-x-8"
              }`}
            >
              <div className="absolute inset-0 flex justify-center items-center transition-all duration-300">
                {theme === "light" ? (
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Plug className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </div>
          </button>
          
          {/* Sign In Button */}
          <button
            onClick={() => router.push("/signin")}
            className={`border-2 text-sm px-4 py-2 rounded-full flex items-center justify-center transition-all duration-300 ${
              scrolling 
                ? "bg-primary text-primary-foreground border-primary hover:bg-accent hover:border-accent hover:text-foreground" 
                : "bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-black"
            } font-semibold`}
          >
            Sign In
          </button>
        </div>
        
        {/* Hamburger Icon for Mobile */}
        <button onClick={toggleMobileMenu} className="lg:hidden ml-4">
          <Menu className={`text-3xl ${scrolling ? "text-foreground" : "text-white"}`} />
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        } mt-4 transition-all duration-300`}
      >
        <div
          className="relative bg-background border border-border p-4 rounded-lg bg-opacity-90"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Mail className="w-6 h-6 text-foreground" />
                <span className="text-sm text-foreground">build@simpleprojex.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-6 h-6 text-foreground" />
                <span className="text-sm text-foreground">Irvine, California</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="w-16 h-8 rounded-full border border-border bg-muted p-1 flex items-center transition-all duration-300 hover:bg-accent"
              >
                <div
                  className={`w-6 h-6 bg-background rounded-full shadow-md transition-all duration-300 transform ${
                    theme === "light" ? "translate-x-0" : "translate-x-8"
                  }`}
                >
                  <div className="absolute inset-0 flex justify-center items-center">
                    {theme === "light" ? (
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Plug className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push("/signin")}
                className="border-2 text-sm px-4 py-2 rounded-full flex items-center justify-center transition-all duration-300 bg-primary text-primary-foreground border-primary hover:bg-accent hover:border-accent hover:text-foreground font-semibold"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
