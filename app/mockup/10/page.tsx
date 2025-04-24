"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Compass,
  FileText,
  Calculator,
  Zap,
  CheckCircle,
  FileCheck,
  Palette,
  ChevronRight,
  Star,
  User,
  Heart,
  Files,
  Clock,
  LifeBuoy,
} from "lucide-react";

// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  CardFooter,
} from "@/components/shared";

import { motion } from "framer-motion";

// Enhanced theme options with background effects and additional themes
const themes = {
  light: {
    primary: "from-blue-400/90 to-indigo-500/90",
    secondary: "from-sky-300/80 to-blue-400/80",
    accent: "from-indigo-300/80 to-purple-400/80",
    text: "text-gray-800",
    cardGradient1: "from-blue-400 to-indigo-500",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-blue-500",
    gradientBg: "bg-gradient-to-b from-blue-50 via-blue-50 to-white",
    gradientText: "from-blue-500 to-indigo-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')]",
    glassShadow: "shadow-blue-200/40",
    borderAccent: "border-blue-200",
    subtleBg: "bg-blue-50/30",
    pageBackground: "bg-gradient-to-br from-blue-50/30 to-indigo-50/20",
    textEffect: "text-shadow-sm shadow-blue-200/10",
    cardEffect: "border-blue-100/50 shadow-blue-100/20",
  },
  dark: {
    primary: "from-indigo-500/90 to-purple-600/90",
    secondary: "from-violet-400/80 to-purple-500/80",
    accent: "from-purple-400/80 to-pink-400/80",
    text: "text-gray-100",
    subtext: "text-gray-300",
    background: "bg-gray-900",
    cardBg: "bg-gray-800",
    nav: "bg-gray-900/90",
    hover: "hover:bg-indigo-600",
    gradientBg: "bg-gradient-to-b from-gray-500 via-gray-800 to-gray-800",
    gradientText: "from-indigo-400 to-purple-400",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/dark-dot.png')]",
    glassShadow: "shadow-indigo-900/40",
    borderAccent: "border-indigo-900",
    subtleBg: "bg-indigo-900/20",
    pageBackground: "bg-gradient-to-br from-gray-900 to-indigo-950/90",
    textEffect: "text-shadow-md shadow-indigo-500/20",
    cardEffect: "border-indigo-800/30 shadow-indigo-900/30",
  },
  teal: {
    primary: "from-teal-400/90 to-emerald-500/90",
    secondary: "from-cyan-300/80 to-teal-400/80",
    accent: "from-emerald-300/80 to-green-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-emerald-500",
    gradientBg: "bg-gradient-to-b from-teal-50 via-teal-50 to-white",
    gradientText: "from-teal-500 to-emerald-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]",
    glassShadow: "shadow-teal-200/40",
    borderAccent: "border-teal-200",
    subtleBg: "bg-teal-50/30",
    pageBackground: "bg-gradient-to-br from-teal-50/40 to-emerald-50/30",
    textEffect: "text-shadow-sm shadow-teal-200/10",
    cardEffect: "border-teal-100/50 shadow-teal-100/20",
  },
  lavender: {
    primary: "from-purple-300/90 to-violet-400/90",
    secondary: "from-purple-200/80 to-purple-300/80",
    accent: "from-violet-300/80 to-fuchsia-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-purple-400",
    gradientBg: "bg-gradient-to-b from-purple-50 via-purple-50 to-white",
    gradientText: "from-purple-400 to-violet-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]",
    glassShadow: "shadow-purple-200/40",
    borderAccent: "border-purple-200",
    subtleBg: "bg-purple-50/30",
    pageBackground: "bg-gradient-to-br from-purple-50/40 to-violet-50/30",
    textEffect: "text-shadow-sm shadow-purple-200/10",
    cardEffect: "border-purple-100/50 shadow-purple-100/20",
  },
  amber: {
    primary: "from-amber-300/90 to-orange-400/90",
    secondary: "from-yellow-300/80 to-amber-400/80",
    accent: "from-orange-300/80 to-red-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-amber-500",
    gradientBg: "bg-gradient-to-b from-amber-50 to-white",
    gradientText: "from-amber-500 to-orange-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')]",
    glassShadow: "shadow-amber-200/40",
    borderAccent: "border-amber-200",
    subtleBg: "bg-amber-50/30",
    pageBackground: "bg-gradient-to-br from-amber-50/40 to-orange-50/30",
    textEffect: "text-shadow-sm shadow-amber-200/10",
    cardEffect: "border-amber-100/50 shadow-amber-100/20",
  },
  rose: {
    primary: "from-rose-300/90 to-pink-400/90",
    secondary: "from-red-300/80 to-rose-400/80",
    accent: "from-pink-300/80 to-fuchsia-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-rose-400",
    gradientBg: "bg-gradient-to-b from-rose-50 to-white",
    gradientText: "from-rose-400 to-pink-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/flowers.png')]",
    glassShadow: "shadow-rose-200/40",
    borderAccent: "border-rose-200",
    subtleBg: "bg-rose-50/30",
    pageBackground: "bg-gradient-to-br from-rose-50/40 to-pink-50/30",
    textEffect: "text-shadow-sm shadow-rose-200/10",
    cardEffect: "border-rose-100/50 shadow-rose-100/20",
  },
  slate: {
    primary: "from-slate-400/90 to-slate-500/90",
    secondary: "from-slate-300/80 to-slate-400/80",
    accent: "from-sky-300/80 to-slate-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-slate-500",
    gradientBg: "bg-gradient-to-b from-slate-50 to-white",
    gradientText: "from-slate-500 to-slate-600",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]",
    glassShadow: "shadow-slate-200/40",
    borderAccent: "border-slate-200",
    subtleBg: "bg-slate-50/30",
    pageBackground: "bg-gradient-to-br from-slate-50/40 to-slate-100/30",
    textEffect: "text-shadow-sm shadow-slate-200/10",
    cardEffect: "border-slate-100/50 shadow-slate-100/20",
  },
  emerald: {
    primary: "from-emerald-400/90 to-green-500/90",
    secondary: "from-emerald-300/80 to-emerald-400/80",
    accent: "from-green-300/80 to-lime-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-emerald-500",
    gradientBg: "bg-gradient-to-b from-emerald-50 to-white",
    gradientText: "from-emerald-500 to-green-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/green-dust-and-scratches.png')]",
    glassShadow: "shadow-emerald-200/40",
    borderAccent: "border-emerald-200",
    subtleBg: "bg-emerald-50/30",
    pageBackground: "bg-gradient-to-br from-emerald-50/40 to-green-50/30",
    textEffect: "text-shadow-sm shadow-emerald-200/10",
    cardEffect: "border-emerald-100/50 shadow-emerald-100/20",
  },
  midnight: {
    primary: "from-blue-600/90 to-indigo-800/90",
    secondary: "from-blue-500/80 to-blue-700/80",
    accent: "from-indigo-500/80 to-violet-700/80",
    text: "text-gray-100",
    subtext: "text-gray-300",
    background: "bg-gray-900",
    cardBg: "bg-gray-800",
    nav: "bg-gray-900/90",
    hover: "hover:bg-indigo-800",
    gradientBg: "bg-gradient-to-b from-gray-900 to-gray-950",
    gradientText: "from-blue-400 to-indigo-400",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/stars.png')]",
    glassShadow: "shadow-blue-900/40",
    borderAccent: "border-blue-900",
    subtleBg: "bg-blue-900/20",
    pageBackground: "bg-gradient-to-br from-gray-900 to-blue-950/90",
    textEffect: "text-shadow-md shadow-blue-500/20",
    cardEffect: "border-blue-800/30 shadow-blue-900/30",
  },
  sunset: {
    primary: "from-orange-400/90 to-red-500/90",
    secondary: "from-amber-300/80 to-orange-400/80",
    accent: "from-red-300/80 to-rose-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-orange-500",
    gradientBg: "bg-gradient-to-b from-orange-50 to-white",
    gradientText: "from-orange-500 to-red-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/wave-grid.png')]",
    glassShadow: "shadow-orange-200/40",
    borderAccent: "border-orange-200",
    subtleBg: "bg-orange-50/30",
    pageBackground: "bg-gradient-to-br from-orange-50/40 to-red-50/30",
    textEffect: "text-shadow-sm shadow-orange-200/10",
    cardEffect: "border-orange-100/50 shadow-orange-100/20",
  },
  aqua: {
    primary: "from-cyan-400/90 to-blue-500/90",
    secondary: "from-sky-300/80 to-cyan-400/80",
    accent: "from-blue-300/80 to-indigo-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-cyan-500",
    gradientBg: "bg-gradient-to-b from-cyan-50 to-white",
    gradientText: "from-cyan-500 to-blue-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/water-drop.png')]",
    glassShadow: "shadow-cyan-200/40",
    borderAccent: "border-cyan-200",
    subtleBg: "bg-cyan-50/30",
    pageBackground: "bg-gradient-to-br from-cyan-50/40 to-blue-50/30",
    textEffect: "text-shadow-sm shadow-cyan-200/10",
    cardEffect: "border-cyan-100/50 shadow-cyan-100/20",
  },
  // New themes
  mint: {
    primary: "from-green-300/90 to-emerald-400/90",
    secondary: "from-green-200/80 to-green-300/80",
    accent: "from-emerald-200/80 to-teal-300/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-green-400",
    gradientBg: "bg-gradient-to-b from-green-50 to-white",
    gradientText: "from-green-400 to-emerald-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/green-fibers.png')]",
    glassShadow: "shadow-green-200/40",
    borderAccent: "border-green-200",
    subtleBg: "bg-green-50/30",
    pageBackground: "bg-gradient-to-br from-green-50/40 to-emerald-50/30",
    textEffect: "text-shadow-sm shadow-green-200/10",
    cardEffect: "border-green-100/50 shadow-green-100/20",
  },
  berry: {
    primary: "from-purple-400/90 to-pink-500/90",
    secondary: "from-fuchsia-300/80 to-purple-400/80",
    accent: "from-pink-300/80 to-rose-400/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-white",
    cardBg: "bg-white",
    nav: "bg-white/90",
    hover: "hover:bg-fuchsia-500",
    gradientBg: "bg-gradient-to-b from-fuchsia-50 to-white",
    gradientText: "from-purple-500 to-pink-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')]",
    glassShadow: "shadow-fuchsia-200/40",
    borderAccent: "border-fuchsia-200",
    subtleBg: "bg-fuchsia-50/30",
    pageBackground: "bg-gradient-to-br from-fuchsia-50/40 to-pink-50/30",
    textEffect: "text-shadow-sm shadow-fuchsia-200/10",
    cardEffect: "border-fuchsia-100/50 shadow-fuchsia-100/20",
  },
  coffee: {
    primary: "from-amber-600/90 to-brown-700/90",
    secondary: "from-amber-500/80 to-amber-600/80",
    accent: "from-brown-500/80 to-amber-700/80",
    text: "text-gray-800",
    subtext: "text-gray-600",
    background: "bg-amber-50",
    cardBg: "bg-white",
    nav: "bg-amber-50/90",
    hover: "hover:bg-amber-600",
    gradientBg: "bg-gradient-to-b from-amber-50 to-amber-50/0",
    gradientText: "from-amber-700 to-yellow-700",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]",
    glassShadow: "shadow-amber-800/40",
    borderAccent: "border-amber-300",
    subtleBg: "bg-amber-100/30",
    pageBackground: "bg-gradient-to-br from-amber-100/40 to-yellow-50/30",
    textEffect: "text-shadow-sm shadow-amber-800/10",
    cardEffect: "border-amber-200/50 shadow-amber-200/20",
  },
  nordic: {
    primary: "from-blue-300/90 to-slate-400/90",
    secondary: "from-slate-300/80 to-blue-300/80",
    accent: "from-slate-200/80 to-gray-300/80",
    text: "text-gray-700",
    subtext: "text-gray-600",
    background: "bg-gray-50",
    cardBg: "bg-white",
    nav: "bg-gray-50/90",
    hover: "hover:bg-blue-300",
    gradientBg: "bg-gradient-to-b from-blue-50 to-gray-50",
    gradientText: "from-blue-400 to-slate-500",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]",
    glassShadow: "shadow-blue-100/40",
    borderAccent: "border-blue-100",
    subtleBg: "bg-blue-50/30",
    pageBackground: "bg-gradient-to-br from-blue-50/40 to-slate-50/30",
    textEffect: "text-shadow-sm shadow-blue-100/10",
    cardEffect: "border-blue-50/50 shadow-blue-50/20",
  },
  neon: {
    primary: "from-purple-500/90 to-pink-600/90",
    secondary: "from-blue-500/80 to-purple-500/80",
    accent: "from-pink-500/80 to-red-500/80",
    text: "text-gray-100",
    subtext: "text-gray-300",
    background: "bg-gray-900",
    cardBg: "bg-gray-800",
    nav: "bg-gray-900/90",
    hover: "hover:bg-purple-500",
    gradientBg: "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950",
    gradientText: "from-purple-400 to-pink-400",
    patternBg:
      "bg-[url('https://www.transparenttextures.com/patterns/neon-grid.png')]",
    glassShadow: "shadow-purple-500/40",
    borderAccent: "border-purple-700",
    subtleBg: "bg-purple-900/20",
    pageBackground: "bg-gradient-to-br from-gray-900 to-purple-950/90",
    textEffect: "text-shadow-lg shadow-purple-500/30",
    cardEffect: "border-purple-700/50 shadow-purple-600/30",
  },
};

// Font options with more variety
const fonts = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
  display: "font-display",
};

// Fade-in animation component with intersection observer
const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}> = ({ children, delay = 0, direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);

  // Direction based transforms
  const transforms = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
    none: "translate-y-0",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0"
          : `opacity-0 ${transforms[direction]}`
      }`}
    >
      {children}
    </div>
  );
};

// Feature card component using shadcn Card
interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  currentTheme: keyof typeof themes;
}

// Template card component
interface TemplateCardProps {
  title: string;
  category: string;
  image: string;
  currentTheme: keyof typeof themes;
}

export default function SimpleProjeXLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof themes>("light");
  const [currentFont, setCurrentFont] = useState<keyof typeof fonts>("sans");
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hover effect for buttons
  const buttonHoverClass = `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`;

  // Apply theme to the entire page
  useEffect(() => {
    // Remove previous theme classes from body
    document.body.className = document.body.className
      .split(" ")
      .filter(
        (cls) =>
          !cls.includes("bg-gradient-") &&
          !cls.includes("from-") &&
          !cls.includes("to-")
      )
      .join(" ");

    // Add new theme background classes to body separately
    const bgClasses = themes[currentTheme].pageBackground.split(" ");
    bgClasses.forEach((cls) => {
      document.body.classList.add(cls);
    });

    // Add smooth transition for background changes
    if (!document.body.classList.contains("transition-colors")) {
      document.body.classList.add("transition-colors", "duration-500");
    }
  }, [currentTheme]);

  // Theme preview component
  const ThemePreview = ({
    themeName,
    onClick,
  }: {
    themeName: keyof typeof themes;
    onClick: () => void;
  }) => {
    const theme = themes[themeName];
    const isDarkTheme =
      themeName === "dark" || themeName === "midnight" || themeName === "neon";

    return (
      <Button
        variant="outline"
        onClick={onClick}
        className={`p-2 h-auto aspect-square ${
          currentTheme === themeName
            ? isDarkTheme
              ? "ring-2 ring-purple-400 ring-offset-1"
              : "ring-2 ring-offset-1"
            : ""
        }`}
      >
        <div
          className={`h-full w-full rounded-md bg-gradient-to-br ${theme.primary}`}
        ></div>
      </Button>
    );
  };

  return (
    <div
      className={`min-h-screen ${themes[currentTheme].background} ${fonts[currentFont]}`}
    >
      {/* Theme customizer button */}
      <button
        onClick={() => setIsThemePanelOpen(!isThemePanelOpen)}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r ${
          themes[currentTheme].primary
        } text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          isThemePanelOpen ? "rotate-180" : ""
        }`}
        aria-label="Open theme customizer"
      >
        <Palette className="h-5 w-5" />
      </button>

      {/* Theme panel */}
      {isThemePanelOpen && (
        <Card
          className={`fixed bottom-20 right-6 z-50 w-80 shadow-xl border ${themes[currentTheme].borderAccent} ${themes[currentTheme].cardEffect} animate-fadeIn`}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`bg-gradient-to-r ${themes[currentTheme].gradientText} bg-clip-text text-transparent`}
            >
              Customize Your Theme
            </CardTitle>
            <CardDescription>
              Create the perfect look for your interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="theme">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="font">Typography</TabsTrigger>
              </TabsList>

              <TabsContent value="theme" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Core Themes</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <ThemePreview
                      themeName="light"
                      onClick={() => setCurrentTheme("light")}
                    />
                    <ThemePreview
                      themeName="dark"
                      onClick={() => setCurrentTheme("dark")}
                    />
                    <ThemePreview
                      themeName="teal"
                      onClick={() => setCurrentTheme("teal")}
                    />
                    <ThemePreview
                      themeName="lavender"
                      onClick={() => setCurrentTheme("lavender")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Special Themes</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <ThemePreview
                      themeName="aqua"
                      onClick={() => setCurrentTheme("aqua")}
                    />
                    <ThemePreview
                      themeName="sunset"
                      onClick={() => setCurrentTheme("sunset")}
                    />
                    <ThemePreview
                      themeName="midnight"
                      onClick={() => setCurrentTheme("midnight")}
                    />
                    <ThemePreview
                      themeName="emerald"
                      onClick={() => setCurrentTheme("emerald")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">New Themes</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <ThemePreview
                      themeName="mint"
                      onClick={() => setCurrentTheme("mint")}
                    />
                    <ThemePreview
                      themeName="berry"
                      onClick={() => setCurrentTheme("berry")}
                    />
                    <ThemePreview
                      themeName="coffee"
                      onClick={() => setCurrentTheme("coffee")}
                    />
                    <ThemePreview
                      themeName="neon"
                      onClick={() => setCurrentTheme("neon")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">More Colors</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <ThemePreview
                      themeName="rose"
                      onClick={() => setCurrentTheme("rose")}
                    />
                    <ThemePreview
                      themeName="amber"
                      onClick={() => setCurrentTheme("amber")}
                    />
                    <ThemePreview
                      themeName="slate"
                      onClick={() => setCurrentTheme("slate")}
                    />
                    <ThemePreview
                      themeName="nordic"
                      onClick={() => setCurrentTheme("nordic")}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="font" className="space-y-1">
                {Object.entries(fonts).map(([key, value]) => (
                  <Button
                    key={key}
                    variant={currentFont === key ? "default" : "outline"}
                    onClick={() => setCurrentFont(key as keyof typeof fonts)}
                    className={`w-full justify-start text-left mb-1 ${
                      currentFont === key
                        ? `bg-gradient-to-r ${themes[currentTheme].primary} text-white`
                        : `hover:bg-gradient-to-r ${themes[currentTheme].subtleBg}`
                    }`}
                  >
                    <span className={value}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  </Button>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 backdrop-blur-md ${
          isScrolled
            ? `${themes[currentTheme].nav} shadow-sm py-2`
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/icons/logo.svg"
              alt="Simple ProjeX Logo"
              className="h-8 w-8"
            />
            <span className={`font-bold text-xl ${themes[currentTheme].text}`}>
              Simple ProjeX
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
            >
              Features
            </a>
            <a
              href="#templates"
              className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
            >
              Templates
            </a>
            <a
              href="#benefits"
              className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
            >
              Benefits
            </a>
            <a
              href="#workflow"
              className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
            >
              Workflow
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button
              className={`bg-gradient-to-r ${themes[currentTheme].primary} text-white`}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={`pt-32 pb-20 px-4 ${themes[currentTheme].gradientBg}`}
      >
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                className="flex-1 space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <motion.span
                  className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${themes[currentTheme].accent} bg-opacity-10 text-sm font-medium text-primary`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Simplify your project workflow
                </motion.span>

                <motion.h1
                  className={`text-5xl md:text-6xl font-bold leading-tight ${themes[currentTheme].text}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  Create{" "}
                  <motion.span
                    className={`bg-gradient-to-r ${themes[currentTheme].gradientText} bg-clip-text text-transparent`}
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "100% 0%" }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    projects
                  </motion.span>{" "}
                  faster than ever before
                </motion.h1>

                <motion.p
                  className={`text-xl ${themes[currentTheme].subtext} max-w-xl`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Simple ProjeX streamlines the process of creating professional
                  proposals, contracts, and project plans with integrated cost
                  calculations.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`bg-gradient-to-r ${themes[currentTheme].primary} text-white ${buttonHoverClass}`}
                    >
                      Start for free{" "}
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-6 pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.7 }}
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className={`h-10 w-10 rounded-full bg-gradient-to-r ${
                          i % 2 === 0
                            ? themes[currentTheme].primary
                            : themes[currentTheme].secondary
                        } flex items-center justify-center border-2 border-white text-xs font-medium text-white`}
                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.15, zIndex: 10 }}
                      >
                        {String.fromCharCode(64 + i)}
                      </motion.div>
                    ))}
                  </div>
                  <motion.p
                    className={`text-sm ${themes[currentTheme].subtext}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.7 }}
                  >
                    <motion.span
                      className="font-medium"
                      animate={{ color: ["#3B82F6", "#8B5CF6", "#3B82F6"] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      5,000+
                    </motion.span>{" "}
                    professionals already using Simple ProjeX
                  </motion.p>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex-1 rounded-2xl p-1 bg-gradient-to-br from-blue-300/20 to-purple-300/20"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                whileHover={{
                  boxShadow: "0 0 25px rgba(79, 70, 229, 0.4)",
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className={`${themes[currentTheme].cardBg} ${themes[currentTheme].glassShadow} rounded-xl overflow-hidden shadow-lg`}
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: 0.8,
                  }}
                >
                  <motion.img
                    src="/mockup/Dashboard.png"
                    alt="Simple ProjeX Dashboard"
                    className="w-full h-auto"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    whileHover={{ scale: 1.02 }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`py-20  ${themes[currentTheme].pageBackground} overflow-hidden relative`}
      >
        {/* Abstract background shapes */}
        <motion.div
          className="absolute inset-0 -z-10 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-3xl" />
          <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-teal-300 to-blue-500 blur-3xl" />
        </motion.div>

        <div className="container mx-auto max-w-6xl px-4">
          <FadeIn delay={200}>
            <div className="text-center mb-16">
              <motion.span
                className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${themes[currentTheme].accent} bg-opacity-10 text-sm font-medium text-primary mb-4`}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
                viewport={{ once: true }}
              >
                Features
              </motion.span>
              <motion.h2
                className={`text-4xl md:text-5xl font-bold ${themes[currentTheme].text} mb-4`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                viewport={{ once: true }}
              >
                Everything you need to create{" "}
                <span
                  className={`bg-gradient-to-r ${themes[currentTheme].gradientText} bg-clip-text text-transparent`}
                >
                  amazing projects
                </span>
              </motion.h2>
              <motion.p
                className={`text-xl ${themes[currentTheme].subtext} max-w-2xl mx-auto`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                viewport={{ once: true }}
              >
                Our platform combines powerful tools with simplicity to help you
                create professional projects in minutes, not hours.
              </motion.p>
            </div>

            {/* Interactive features showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
              {/* Large featured item */}
              <motion.div
                className={`lg:col-span-3 rounded-2xl overflow-hidden ${themes[currentTheme].cardBg} ${themes[currentTheme].glassShadow} shadow-lg p-8 relative group`}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <motion.div
                    className="flex-shrink-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                  >
                    <FileText className="w-16 h-16 text-indigo-600" />
                  </motion.div>
                  <div>
                    <h3
                      className={`text-2xl font-bold mb-4 ${themes[currentTheme].text}`}
                    >
                      Smart Templates Library
                    </h3>
                    <p className={`${themes[currentTheme].subtext} mb-6`}>
                      Access professional templates for any project type, with
                      intelligent suggestions based on your industry and project
                      requirements. Our AI-powered system helps you find the
                      perfect starting point for your project.
                    </p>
                    <motion.button
                      className={`${themes[currentTheme].subtext} flex items-center text-sm font-medium`}
                      whileHover={{ x: 5 }}
                    >
                      Explore templates <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Interactive elements */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-indigo-500"
                        animate={{
                          y: [0, -5, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Calculation tool preview */}
              <motion.div
                className={`lg:col-span-2 rounded-2xl ${themes[currentTheme].cardBg} ${themes[currentTheme].glassShadow} shadow-lg overflow-hidden relative group`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-teal-400 to-cyan-500"></div>
                <div className="p-6">
                  <Calculator className="h-8 w-8 text-teal-500 mb-4" />
                  <h3
                    className={`text-xl font-bold mb-2 ${themes[currentTheme].text}`}
                  >
                    Interactive Cost Calculator
                  </h3>
                  <p className={`${themes[currentTheme].subtext} text-sm mb-4`}>
                    Calculate project costs in real-time as you build
                  </p>
                </div>

                <motion.div
                  className="px-6 pb-6"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  <div
                    className={`rounded-lg p-4 ${
                      currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="space-y-3">
                      {["Design", "Development", "Testing"].map((item, i) => (
                        <motion.div
                          key={item}
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.2 }}
                          viewport={{ once: true }}
                        >
                          <span className={themes[currentTheme].text}>
                            {item}
                          </span>
                          <span
                            className={`${themes[currentTheme].text} font-medium`}
                          >
                            ${(i + 1) * 1000}
                          </span>
                        </motion.div>
                      ))}
                      <motion.div
                        className="h-px w-full bg-gray-300 my-2"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: 0.8 }}
                        viewport={{ once: true }}
                      />
                      <div className="flex justify-between items-center font-bold">
                        <span className={themes[currentTheme].text}>Total</span>
                        <motion.span
                          className={`${themes[currentTheme].text}`}
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          $6,000
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Animated features grid */}
            <div
              className={`${themes[currentTheme].subtext} grid md:grid-cols-3 gap-8`}
            >
              {[
                {
                  icon: FileCheck,
                  title: "Contract Generator",
                  description:
                    "Create legally-sound contracts with our simple builder",
                  color: "from-pink-500 to-rose-500",
                  delay: 0.1,
                },
                {
                  icon: Zap,
                  title: "Fast Creation",
                  description:
                    "Build complete project proposals in minutes with intuitive tools",
                  color: "from-amber-500 to-orange-500",
                  delay: 0.3,
                },
                {
                  icon: Compass,
                  title: "Project Tracking",
                  description:
                    "Monitor project progress and keep clients updated in real-time",
                  color: "from-emerald-500 to-teal-500",
                  delay: 0.5,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`rounded-xl ${themes[currentTheme].cardBg} ${themes[currentTheme].glassShadow} shadow-md overflow-hidden group relative`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: feature.delay, duration: 0.7 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${feature.color}`}
                  />
                  <div className="p-6">
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      className="mb-5 inline-block"
                    >
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-10`}
                      >
                        <feature.icon
                          className={`${themes[currentTheme].subtext} h-6 w-6 bg-gradient-to-r bg-clip-text`}
                          style={{
                            backgroundImage: `linear-gradient(to right, ${feature.color
                              .replace("from-", "")
                              .replace("to-", "")})`,
                          }}
                        />
                      </div>
                    </motion.div>

                    <h3
                      className={`text-xl font-bold mb-3 ${themes[currentTheme].text} group-hover:text-primary transition-colors`}
                    >
                      {feature.title}
                    </h3>
                    <p className={`${themes[currentTheme].subtext}`}>
                      {feature.description}
                    </p>
                  </div>

                  <motion.div
                    className="absolute bottom-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-10"
                    initial={{ scale: 0.5, rotate: -10 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <feature.icon className="w-full h-full" />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Interactive feature showcase */}
            <motion.div
              className={`mt-16 rounded-2xl overflow-hidden ${themes[currentTheme].cardBg} shadow-xl relative`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-20"
                animate={{
                  background: [
                    "linear-gradient(to bottom right, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.2))",
                    "linear-gradient(to bottom right, rgba(6, 182, 212, 0.2), rgba(37, 99, 235, 0.2))",
                    "linear-gradient(to bottom right, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.2))",
                  ],
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-12 w-12 text-green-500 mb-6" />
                  </motion.div>
                  <motion.h3
                    className={`text-2xl md:text-3xl font-bold mb-4 ${themes[currentTheme].text}`}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    Seamless Client Approval Process
                  </motion.h3>
                  <motion.p
                    className={`${themes[currentTheme].subtext} mb-6`}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    Get digital signatures and track client feedback on projects
                    with our intuitive approval system. Clients can review,
                    comment, and approve your work directly from any device.
                  </motion.p>

                  <motion.div
                    className="flex gap-4 items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    viewport={{ once: true }}
                  >
                    <motion.button
                      className={`px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium flex items-center`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      See how it works <ChevronRight className="ml-2 h-4 w-4" />
                    </motion.button>
                    <motion.span
                      className={`${themes[currentTheme].subtext} text-sm`}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      4x faster approvals
                    </motion.span>
                  </motion.div>
                </div>

                <div className="relative h-full min-h-64">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className={`bg-gradient-to-br ${
                        currentTheme === "dark"
                          ? "from-gray-700 to-gray-800"
                          : "from-white to-gray-100"
                      } rounded-xl shadow-lg p-6 m-6 relative`}
                      initial={{ y: 50 }}
                      whileInView={{ y: 0 }}
                      transition={{ type: "spring", stiffness: 50, delay: 0.9 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4
                            className={`font-medium ${themes[currentTheme].text}`}
                          >
                            Client Approval
                          </h4>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.div
                                key={star}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + star * 0.1 }}
                                viewport={{ once: true }}
                              >
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <motion.div
                        className={`h-1 w-full mb-4 rounded-full ${
                          currentTheme === "dark"
                            ? "bg-gray-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <motion.div
                          className="h-1 bg-green-500 rounded-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: "85%" }}
                          transition={{ delay: 1.3, duration: 1.5 }}
                          viewport={{ once: true }}
                        />
                      </motion.div>

                      <div className="space-y-3">
                        {[
                          "Design Mockups",
                          "Content Copy",
                          "Pricing Structure",
                        ].map((item, i) => (
                          <motion.div
                            key={item}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5 + i * 0.2 }}
                            viewport={{ once: true }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className={themes[currentTheme].text}>
                              {item}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        className="absolute -bottom-3 -right-3 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-medium"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", delay: 2.2 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                      >
                        Approved
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* Templates Showcase with Grid Layout and Features */}
      <section
        id="templates"
        className="py-24 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/30"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <FadeIn delay={300}>
            <div className="text-center mb-16">
              <motion.span
                className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${themes[currentTheme].accent} bg-opacity-20 text-sm font-medium text-primary mb-4`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Ready-made Templates
              </motion.span>
              <motion.h2
                className={`text-4xl md:text-5xl font-bold ${themes[currentTheme].text} mb-6`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Professional templates for every need
              </motion.h2>
              <motion.p
                className={`text-xl ${themes[currentTheme].subtext} max-w-2xl mx-auto`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Get your projects up and running quickly with our expertly
                crafted templates, or create your own custom design from
                scratch.
              </motion.p>
            </div>

            {/* Template Grid with Hover Effects */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 ${themes[currentTheme].glassShadow}`}
            >
              {[
                {
                  title: "Template 1",
                  category: "Templates",
                  image: "/template/template1.jpg",
                  tags: ["Variables", "Modules"],
                },
                {
                  title: "Template 2",
                  category: "Templates",
                  image: "/template/template2.jpg",
                  tags: ["Variables", "Modules"],
                },
                {
                  title: "Template 3",
                  category: "Templates",
                  image: "/template/template3.webp",
                  tags: ["Variables", "Modules"],
                },
                {
                  title: "Template 4",
                  category: "Templates",
                  image: "/template/template1.jpg",
                  tags: ["Variables", "Modules"],
                },
                {
                  title: "Template 5",
                  category: "Templates",
                  image: "/template/template2.jpg",
                  tags: ["Variables", "Modules"],
                },
                {
                  title: "Template 6",
                  category: "Templates",
                  image: "/template/template3.webp",
                  tags: ["Variables", "Modules"],
                },
              ].map((template, index) => (
                <motion.div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl shadow-lg ${themes[currentTheme].glassShadow}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 0.9 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <motion.span
                        className="text-sm font-medium"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {template.category}
                      </motion.span>
                      <div className="flex space-x-2">
                        {template.tags?.map((tag, i) => (
                          <motion.span
                            key={i}
                            className="text-xs px-2 py-1 bg-white/20 rounded-full"
                            initial={{ scale: 0.8 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            whileHover={{
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                              scale: 1.05,
                            }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <motion.h3
                      className="text-xl font-bold mb-1"
                      initial={{ y: 10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {template.title}
                    </motion.h3>
                    <div className="flex justify-between items-center mt-3">
                      <motion.span
                        className="text-sm opacity-75"
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 0.75 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ x: 3 }}
                      >
                        View details
                      </motion.span>
                      <motion.button
                        className="p-2 rounded-full bg-white/10"
                        whileHover={{
                          scale: 1.2,
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  className={`bg-gradient-to-r ${themes[currentTheme].primary} text-white px-8 py-6 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all ${buttonHoverClass}`}
                >
                  Explore All Templates
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="text-center mb-20">
              <motion.span
                className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${themes[currentTheme].accent} bg-opacity-20 text-sm font-medium text-primary mb-4`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                viewport={{ once: true }}
              >
                Simple Process
              </motion.span>
              <motion.h2
                className={`text-4xl md:text-5xl font-bold ${themes[currentTheme].text} mb-6`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                viewport={{ once: true }}
              >
                How it works
              </motion.h2>
              <motion.p
                className={`text-xl ${themes[currentTheme].subtext} max-w-2xl mx-auto`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                viewport={{ once: true }}
              >
                Get your projects done faster with our streamlined workflow
              </motion.p>
            </div>

            <div className="relative">
              {/* Animated connecting line */}
              <motion.div
                className="absolute left-1/2 top-12 bottom-0 w-0.5 hidden md:block"
                initial={{
                  height: 0,
                  background:
                    "linear-gradient(to bottom, rgba(79, 70, 229, 0.8), rgba(79, 70, 229, 0))",
                }}
                whileInView={{ height: "80%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
              />

              <div className="grid md:grid-cols-3 gap-12 relative">
                {[
                  {
                    id: 1,
                    title: "Create a Template",
                    description:
                      "Start by creating customizable templates for different types of projects. Save time by reusing your best proposal structures.",
                    icon: "📋",
                  },
                  {
                    id: 2,
                    title: "Create a Proposal",
                    description:
                      "Fill in project details, customize pricing, and adjust parameters. Our smart system helps you calculate costs accurately and efficiently.",
                    icon: "⚡",
                  },
                  {
                    id: 3,
                    title: "Send Out the Proposal",
                    description:
                      "Review your professional proposal and send it directly to your clients. Track when they view it and get instant notifications on responses.",
                    icon: "✉️",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className={`relative ${themes[currentTheme].glassShadow}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.3,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }}
                  >
                    <motion.div
                      className={`flex flex-col items-center text-center p-8 rounded-2xl transition-all bg-gradient-to-br ${themes[currentTheme].gradientBg} ${themes[currentTheme].glassShadow} shadow-lg`}
                      whileHover={{
                        y: -12,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        transition: {
                          duration: 0.3,
                          type: "spring",
                          stiffness: 300,
                        },
                      }}
                    >
                      <motion.div
                        className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-white/90 shadow-lg text-3xl"
                        whileHover={{
                          rotate: [0, -10, 10, -5, 0],
                          scale: 1.1,
                          transition: { duration: 0.6, ease: "easeInOut" },
                        }}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          delay: index * 0.4 + 0.3,
                        }}
                      >
                        {step.icon}
                      </motion.div>

                      <motion.div
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white font-bold"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.3 + 0.5,
                          type: "spring",
                          stiffness: 500,
                          damping: 15,
                        }}
                        whileHover={{
                          scale: 1.2,
                          rotate: 10,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {step.id}
                      </motion.div>

                      <motion.h3
                        className={`text-xl font-bold mb-4 ${themes[currentTheme].text}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.3 + 0.6 }}
                      >
                        {step.title}
                      </motion.h3>

                      <motion.p
                        className={`${themes[currentTheme].subtext}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.3 + 0.7 }}
                      >
                        {step.description}
                      </motion.p>

                      {/* Connection dots between steps (only for first two cards) */}
                      {index < 2 && (
                        <motion.div
                          className="absolute -right-6 top-1/2 hidden md:block"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.3 + 0.9 }}
                        >
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((dot) => (
                              <motion.div
                                key={dot}
                                className="h-2 w-2 rounded-full bg-primary/70"
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  delay: dot * 0.2,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  className={`bg-gradient-to-r ${themes[currentTheme].secondary} text-white px-8 py-6 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all ${buttonHoverClass}`}
                >
                  Get Started Now
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* Benefits Section with Framer Motion */}
      <section
        id="benefits"
        className={`py-24 ${themes[currentTheme].gradientBg}`}
      >
        <div className="container mx-auto max-w-6xl px-4">
          <FadeIn delay={400}>
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${themes[currentTheme].accent} bg-opacity-20 text-sm font-medium text-primary mb-4`}
              >
                Why Choose Us
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-4xl md:text-5xl font-bold ${themes[currentTheme].text} mb-6`}
              >
                Save time and boost productivity
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-xl ${themes[currentTheme].subtext} max-w-2xl mx-auto`}
              >
                See how Simple ProjeX transforms your project workflow with
                powerful features designed for modern teams.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "80% Faster Project Creation",
                  description:
                    "Create professional projects in minutes instead of hours with our intuitive tools and templates. Automate repetitive tasks and focus on what matters.",
                  icon: Zap,
                  color: "from-blue-500 to-indigo-600",
                  textColor: "text-blue-600",
                  delay: 0.3,
                },
                {
                  title: "Streamlined Workflow",
                  description:
                    "Manage everything from proposal to contract to project documentation in one seamless platform. No more switching between multiple tools.",
                  icon: FileCheck,
                  color: "from-purple-500 to-pink-600",
                  textColor: "text-purple-600",
                  delay: 0.5,
                },
                {
                  title: "Professional Results",
                  description:
                    "Impress clients with polished, branded documents that look like they took days to create. Our smart templates ensure consistent quality every time.",
                  icon: CheckCircle,
                  color: "from-emerald-500 to-teal-600",
                  textColor: "text-emerald-600",
                  delay: 0.7,
                },
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: benefit.delay,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <Card
                      className={`border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden h-full ${themes[currentTheme].gradientBg} ${themes[currentTheme].glassShadow}`}
                    >
                      <div
                        className="h-2 w-full"
                        style={{
                          background: `linear-gradient(to right, var(--${
                            benefit.color.split("-")[1]
                          }-500), var(--${benefit.color.split("-")[3]}-600))`,
                        }}
                      ></div>
                      <CardHeader
                        className={`flex flex-row items-center gap-4 pb-2 ${themes[currentTheme].text}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                          className={`p-3 rounded-full bg-gradient-to-r ${benefit.color} text-white shadow-md`}
                        >
                          <Icon className="h-6 w-6" />
                        </motion.div>
                        <CardTitle className="text-xl font-bold">
                          {benefit.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p
                          className={`text-md ${themes[currentTheme].subtext}`}
                        >
                          {benefit.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <motion.button
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className={`flex items-center text-sm font-medium ${benefit.textColor} dark:text-blue-400`}
                        >
                          Learn more <ArrowRight className="h-4 w-4 ml-2" />
                        </motion.button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Integrated Cost Calculator Section */}
      <section id="workflow" className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <FadeIn delay={500}>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                className="flex-1 rounded-xl overflow-hidden shadow-lg order-2 md:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
              >
                <motion.div className="relative overflow-hidden">
                  <motion.img
                    src="/mockup/CostCalcu.png"
                    alt="Integrated Cost Calculator"
                    className="w-full h-auto"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Interactive overlay elements */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-lg p-2 shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Calculator className="h-5 w-5 text-blue-500" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div
                      className={`h-full bg-gradient-to-r ${themes[currentTheme].primary}`}
                    ></div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex-1 space-y-6 order-1 md:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${themes[currentTheme].accent} bg-opacity-10 text-sm font-medium text-primary`}
                >
                  Integrated Workflow
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className={`text-4xl font-bold ${themes[currentTheme].text}`}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Seamless{" "}
                  </motion.span>
                  <motion.span
                    className={`inline-block bg-gradient-to-r ${themes[currentTheme].gradientText} bg-clip-text text-transparent`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    project creation{" "}
                  </motion.span>
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    from start to finish
                  </motion.span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className={`text-lg ${themes[currentTheme].subtext}`}
                >
                  Our platform integrates cost calculations directly into your
                  proposal creation process. Add materials, labor, and other
                  expenses as you build, and watch the totals update in
                  real-time.
                </motion.p>

                <motion.ul
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  {[
                    "Create beautiful proposals with embedded cost breakdowns",
                    "Adjust variables and see calculations update instantly",
                    "Generate professional contracts with just one click",
                    "Keep clients updated with real-time project tracking",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <CheckCircle
                          className={`h-5 w-5 text-gradient-to-r ${themes[currentTheme].primary} flex-shrink-0 mt-0.5`}
                        />
                      </motion.div>
                      <span className={themes[currentTheme].text}>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  viewport={{ once: true }}
                  className="pt-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className={`bg-gradient-to-r ${themes[currentTheme].primary} text-white ${buttonHoverClass} mt-4`}
                    >
                      See how it works{" "}
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-10 ${themes[currentTheme].nav}`}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img
                src="/icons/logo.svg"
                alt="Simple ProjeX Logo"
                className="h-8 w-8"
              />
              <span
                className={`font-bold text-xl ${themes[currentTheme].text}`}
              >
                Simple ProjeX
              </span>
            </div>

            <nav className="flex items-center space-x-8 mb-4 md:mb-0">
              <a
                href="#features"
                className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
              >
                Features
              </a>
              <a
                href="#templates"
                className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
              >
                Templates
              </a>
              <a
                href="#benefits"
                className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
              >
                Benefits
              </a>
              <a
                href="#workflow"
                className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
              >
                Workflow
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="hidden sm
:inline-flex"
              >
                Log in
              </Button>
              <Button
                className={`bg-gradient-to-r ${themes[currentTheme].primary} text-white`}
              >
                Get Started
              </Button>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className={`text-sm ${themes[currentTheme].subtext}`}>
              &copy; {new Date().getFullYear()} Simple ProjeX. All rights
              reserved.
            </p>
            <p className={`text-sm ${themes[currentTheme].subtext}`}>
              <a
                href="#"
                className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
              >
                Privacy Policy
              </a>{" "}
              |{" "}
              <a
                href="#"
                className={`${themes[currentTheme].subtext} hover:text-primary transition-colors`}
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
