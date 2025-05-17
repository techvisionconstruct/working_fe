"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Calendar,
  Clock,
  Flame,
  Lightbulb,
  Rocket,
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  BarChart3,
  Briefcase,
  Target,
  Users,
  Zap,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  SunIcon,
  MoonIcon,
  Palette,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shared";
import { motion } from "framer-motion";
import { FontCombobox } from "@/components/font-combobox";
import { ThemeProvider, useTheme } from "@/components/contexts/theme-context";

export default function Page() {
  return (
    <ThemeProvider>
      <main className="min-h-screen overflow-hidden">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <BlogSection />
        <FQASection />
        <Footer />
      </main>
    </ThemeProvider>
  );
}

function Header() {
  const [minimized, setMinimized] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const { colors, theme, setTheme, setFonts, swatch, setSwatch } = useTheme();

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setThemeMenuOpen(false);
      }
    }
    if (themeMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [themeMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setMinimized(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 backdrop-blur-md ${
        minimized ? "bg-white/90 shadow-sm py-2" : "bg-white py-5"
      }`}
      style={{
        background: theme === "dark" ? "#191919" : "#fff",
        color: theme === "dark" ? "#fff" : "#191919",
        borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <div className={`relative w-8 h-8 flex items-center justify-center`}>
            <img
              src={
                theme === "dark" ? "/icons/logo-white.png" : "/icons/logo.svg"
              }
              alt="Simple ProjeX Logo"
              width={32}
              height={32}
              className={`transition-transform duration-300 ${
                minimized ? "scale-75" : "scale-100"
              }`}
            />
          </div>
          <span
            className="font-bold text-xl"
            style={{
              color: theme === "dark" ? "#fff" : "#191919",
            }}
          >
            Simple ProjeX
          </span>
        </div>

        {/* Navigation */}
        <nav
          className="hidden md:flex items-center space-x-8"
          style={{
            color: theme === "dark" ? "#fff" : "#191919",
          }}
        >
          <a
            href="#features"
            className="hover:text-[#e11d48] transition-colors flex items-center gap-1"
          >
            <Flame className="w-4 h-4" />
            <span>Features</span>
          </a>
          <a
            href="#blog"
            className="hover:text-[#e11d48] transition-colors flex items-center gap-1"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Blog</span>
          </a>
          <a
            href="#faq"
            className="hover:text-[#e11d48] transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Theme */}
          <div>
            <div className="relative" ref={themeMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200 shadow hover:bg-gray-100 transition-all"
                style={{
                  background: theme === "dark" ? "#23272e" : "#fff",
                  color: theme === "dark" ? "#fff" : "#191919",
                }}
                onClick={() => setThemeMenuOpen((v) => !v)}
                aria-label="Open theme menu"
              >
                <Palette className="h-7 w-7" />
              </Button>

              {themeMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in p-4"
                  style={{
                    background: theme === "dark" ? "#23272e" : "#fff",
                    color: theme === "dark" ? "#fff" : "#191919",
                  }}
                >
                  {/* Dark Mode Toggle */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-50 transition mb-2 hover:opacity-80 transition-opacity"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      aria-label="Toggle dark mode"
                      style={{
                        color: theme === "dark" ? "#fff" : "#191919",
                        background:
                          theme === "dark" ? "#23272e40" : "#f8fafc40",
                        backdropFilter: "blur(8px)",
                        boxShadow: `0 2px 10px #e11d4815`,
                      }}
                    >
                      {theme === "dark" ? (
                        <SunIcon className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <MoonIcon className="h-5 w-5 text-indigo-400" />
                      )}
                      <span className="font-medium">
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </span>
                    </Button>
                  </motion.div>

                  <div className="text-xs text-gray-400 text-center my-2">
                    Customize your look
                  </div>

                  {/* Palette Picker */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1">
                      PALETTE
                    </label>
                    <Select value={swatch} onValueChange={setSwatch}>
                      <SelectTrigger
                        className="w-full hover:ring-2 hover:ring-opacity-50 transition-all duration-300"
                        style={{
                          background:
                            theme === "dark" ? "#23272e70" : "#f8fafc70",
                          borderColor:
                            theme === "dark" ? "#33330" : "#e5e7eb30",
                          color: theme === "dark" ? "#fff" : "#191919",
                          backdropFilter: "blur(10px)",
                          boxShadow: `0 4px 12px #e11d4810`,
                        }}
                      >
                        <SelectValue placeholder="Select palette" />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          background:
                            theme === "dark" ? "#23272e90" : "#f8fafc90",
                          borderColor: theme === "dark" ? "#333" : "#e5e7eb",
                          color: theme === "dark" ? "#fff" : "#191919",
                          backdropFilter: "blur(20px)",
                        }}
                      >
                        <SelectItem value="red">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-red-600 border border-gray-300"></span>
                            Red
                          </span>
                        </SelectItem>
                        <SelectItem value="blue">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-600 border border-gray-300"></span>
                            Blue
                          </span>
                        </SelectItem>
                        <SelectItem value="green">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-green-600 border border-gray-300"></span>
                            Green
                          </span>
                        </SelectItem>
                        <SelectItem value="dark">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-neutral-900 border border-gray-300"></span>
                            Dark
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Picker */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      FONT
                    </label>
                    <FontCombobox />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="hidden sm:inline-flex border-[#e5e7eb] text-[#191919] hover:bg-[#191919] hover:text-white transition-colors"
              style={{
                background: theme === "dark" ? "#23272e" : "#fff",
                color: theme === "dark" ? "#fff" : "#191919",
                borderColor: theme === "dark" ? "#333" : "#e5e7eb",
              }}
            >
              Sign In
            </Button>
            <Button
              className="text-white border-none"
              style={{
                background: "#e11d48",
                color: "#fff",
                border: "none",
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  const { theme } = useTheme();
  return (
    <section
      className="pt-32 pb-20 px-4 min-h-screen flex items-center relative overflow-hidden"
      style={{
        background: theme === "dark" ? "#191919" : "#fff",
        color: theme === "dark" ? "#fff" : "#191919",
      }}
    >
      <div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl"
        style={{ background: "#e11d481A" }}
      ></div>
      <div
        className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "#e11d480D" }}
      ></div>

      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Left Side */}
        <div className="flex-1 flex flex-col items-start max-w-xl space-y-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full"
            style={{
              background: "#e11d48",
              color: "#fff",
              borderColor: "#e11d484D",
            }}
          >
            <Rocket className="w-3.5 h-3.5 mr-1.5" />
            <span>Revolutionizing Project Management</span>
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Create projects{" "}
            <span
              className="relative inline-block"
              style={{ color: "#e11d48" }}
            >
              faster
              <span
                className="absolute left-0 -bottom-1 h-1.5 w-full rounded-full"
                style={{ background: "#e11d48CC" }}
              ></span>
            </span>{" "}
            than ever before!
          </h1>

          <p
            className="text-xl max-w-xl"
            style={{
              color: theme === "dark" ? "#e5e5e5" : "#444",
            }}
          >
            Simple ProjeX transforms how professionals create proposals,
            contracts, and project plans with AI-powered templates and real-time
            cost calculations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full max-w-md">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 placeholder-gray-400"
              style={{
                background: theme === "dark" ? "#23272e" : "#fff",
                borderColor: "#e11d48",
                color: theme === "dark" ? "#fff" : "#191919",
              }}
            />
            <Button
              className="px-8 gap-2 group"
              style={{
                background: "#e11d48",
                color: "#fff",
                border: "none",
              }}
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Avatar
                  key={i}
                  className="border-2 w-8 h-8"
                  style={{ borderColor: theme === "dark" ? "#fff" : "#191919" }}
                >
                  <AvatarImage
                    src={`/placeholder.svg?height=32&width=32&text=${i}`}
                  />
                  <AvatarFallback
                    className="text-xs"
                    style={{
                      background: "#e11d4822",
                      color: "#e11d48",
                    }}
                  >
                    U{i}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p
              className="text-sm"
              style={{
                color: theme === "dark" ? "#bbb" : "#666",
              }}
            >
              <span
                className="font-medium"
                style={{ color: theme === "dark" ? "#fff" : "#191919" }}
              >
                5,000+
              </span>{" "}
              professionals trust Simple ProjeX
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <div
              className="absolute inset-0 rounded-3xl transform rotate-6"
              style={{
                background:
                  "linear-gradient(135deg, #e11d4833 0%, transparent 100%)",
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-3xl transform -rotate-3"
              style={{
                background:
                  "linear-gradient(45deg, #e11d481A 0%, transparent 100%)",
              }}
            ></div>
            <div
              className="relative border rounded-2xl shadow-2xl overflow-hidden w-full h-full flex items-center justify-center"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #23272e 0%, #191919 100%)"
                    : "linear-gradient(135deg, #f8fafc 0%, #fff 100%)",
                borderColor: theme === "dark" ? "#23272e" : "#e5e7eb",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #e11d48, transparent)",
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #e11d48, transparent)",
                }}
              ></div>
              <div
                className="text-xl font-medium flex flex-col items-center gap-4"
                style={{
                  color: theme === "dark" ? "#bbb" : "#555",
                }}
              >
                <Zap className="w-12 h-12" style={{ color: "#e11d48" }} />
                <span>Demo Video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { theme } = useTheme();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const features = [
    {
      icon: <Target className="h-6 w-6 text-red-600" />,
      title: (
        <>
          <span className={theme === "dark" ? "text-white" : "text-black"}>
            1.{" "}
          </span>
          <span className="text-red-600">Create Your Account</span>
        </>
      ),
      description:
        "Sign up with your email and set a secure password. No credit card required to start your free trial.",
      demo: (
        <div
          className={`h-full w-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-[#23272e] border-[#333]"
              : "bg-white border-gray-200"
          } rounded-lg shadow-inner overflow-hidden`}
        >
          <div className="w-full h-full p-8 flex flex-col items-center justify-center">
            <img
              src="/template/register.png"
              alt="Sign Up"
              className="w-full h-full mb-6"
            />
            <h3
              className={`text-xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Sign Up
            </h3>
            <p
              className={`text-center mb-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Enter your email and create a password to get started instantly.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
              Create Account
            </Button>
          </div>
        </div>
      ),
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-red-600" />,
      title: (
        <>
          <span className={theme === "dark" ? "text-white" : "text-black"}>
            2.{" "}
          </span>
          <span className="text-red-600">Set Up Your First Proposal</span>
        </>
      ),
      description:
        "Add your company details and create your first project using our guided setup. Choose a template or start from scratch.",
      demo: (
        <div
          className={`h-full w-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-[#23272e] border-[#333]"
              : "bg-white border-gray-200"
          } rounded-lg shadow-inner overflow-hidden`}
        >
          <div className="w-full h-full p-8 flex flex-col items-center justify-center">
            <img
              src="/template/create-proposal.png"
              alt="Project Setup"
              className="w-full h-full mb-6"
            />
            <h3
              className={`text-xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Project Setup
            </h3>
            <p
              className={`text-center mb-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Fill in your project details and select a template to jumpstart
              your workflow.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
              Start Proposal
            </Button>
          </div>
        </div>
      ),
    },
    {
      icon: <Clock className="h-6 w-6 text-red-600" />,
      title: (
        <>
          <span className={theme === "dark" ? "text-white" : "text-black"}>
            3.{" "}
          </span>
          <span className="text-red-600">Send Contracts to Clients</span>
        </>
      ),
      description: "Easily send contract to clients for your proposal.",
      demo: (
        <div
          className={`h-full w-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-[#23272e] border-[#333]"
              : "bg-white border-gray-200"
          } rounded-lg shadow-inner overflow-hidden`}
        >
          <div className="w-full h-full p-8 flex flex-col items-center justify-center">
            <img
              src="/template/contract-email.png"
              alt="Send Contract"
              className="w-full h-full mb-6"
            />
            <h3
              className={`text-xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Contract Making
            </h3>
            <p
              className={`text-center mb-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Send contracts to your clients and sign it right away.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
              Send Contract
            </Button>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, hasMounted, features.length]);

  const handleUserSelect = (idx: number) => {
    setActiveFeature(idx);
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => setIsPaused(false), 1000);
  };

  return (
    <section
      id="features"
      className={`py-20 md:py-24 relative ${
        theme === "dark" ? "bg-[#191919] text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 ${
          theme === "dark" ? "bg-red-900/20" : "bg-red-900/10"
        } rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 ${
          theme === "dark" ? "bg-red-900/10" : "bg-red-900/5"
        } rounded-full blur-3xl`}
      ></div>
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px w-12 bg-red-600"></div>
          <Badge
            variant="outline"
            className="text-red-600 border-red-200 font-medium uppercase tracking-wider px-3"
            style={{
              background: theme === "dark" ? "#23272e" : undefined,
              color: theme === "dark" ? "#fff" : "#e11d48",
              borderColor: theme === "dark" ? "#333" : "#e11d48",
            }}
          >
            Features
          </Badge>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Everything You Need <span className="text-red-600">to Succeed</span>
        </h2>

        <p
          className={`text-lg mb-12 max-w-3xl ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Simple ProjeX is designed to make your project management easier and
          more efficient, with powerful tools that adapt to your specific
          industry needs.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8">
          {/* Demo Content on the left */}
          <div
            className={`relative h-[400px] md:h-[570px] flex items-center justify-center rounded-2xl border overflow-hidden ${
              theme === "dark"
                ? "bg-[#23272e] border-[#333]"
                : "bg-gray-50 border-gray-100"
            }`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {hasMounted && (
              <div className="w-full h-full p-4">
                {features[activeFeature].demo}
              </div>
            )}
          </div>

          {/* Feature List on the right */}
          <div className="space-y-3">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                  activeFeature === idx
                    ? theme === "dark"
                      ? "border-red-900 bg-gradient-to-br from-red-900/20 to-[#23272e] shadow-sm"
                      : "border-red-200 bg-gradient-to-br from-red-50/50 to-white shadow-sm"
                    : theme === "dark"
                    ? "border-[#333] hover:border-red-900"
                    : "border-gray-200 hover:border-red-100"
                }`}
                onClick={() => handleUserSelect(idx)}
              >
                <CardHeader className="p-4 pb-2 flex flex-row items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      activeFeature === idx
                        ? "bg-red-100"
                        : theme === "dark"
                        ? "bg-[#23272e]"
                        : "bg-gray-100"
                    } flex items-center justify-center`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle
                      className={`text-xl transition-colors duration-300 ${
                        activeFeature === idx ? "text-red-600" : ""
                      }`}
                    >
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 pl-16">
                  <p
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center pt-4 gap-2">
              {features.map((_, idx) => (
                <button
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeFeature
                      ? "bg-red-500 w-8"
                      : theme === "dark"
                      ? "bg-gray-700 w-4 hover:bg-gray-600"
                      : "bg-gray-300 w-4 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to feature ${idx + 1}`}
                  onClick={() => handleUserSelect(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  const posts = [
    {
      title: "The Future of Construction Project Management in 2025",
      date: "May 13, 2025",
      author: {
        name: "Simple ProjeX Admin",
        role: "Platform Team",
        avatar: "/icons/logo.svg",
      },
      excerpt:
        "Discover how AI-powered templates and real-time collaboration are transforming how construction professionals manage projects, with productivity gains of up to 40% reported by early adopters.",
      image: "/template/template1.jpg",
      tags: ["AI", "Industry Trends"],
      readTime: "6 min read",
      link: "#",
    },
    {
      title: "How to Cut Estimation Time in Half While Improving Accuracy",
      date: "May 7, 2025",
      author: {
        name: "Simple ProjeX Admin",
        role: "Platform Team",
        avatar: "/icons/logo.svg",
      },
      excerpt:
        "Learn the proven strategies that top contractors are using to create faster, more accurate estimates. We break down the exact workflow that saved one company over 20 hours per week on paperwork.",
      image: "/template/template2.jpg",
      tags: ["Productivity", "Case Study"],
      readTime: "8 min read",
      link: "#",
    },
    {
      title:
        "Specialized Templates: The Secret Weapon for Electrical Contractors",
      date: "April 28, 2025",
      author: {
        name: "Simple ProjeX Admin",
        role: "Platform Team",
        avatar: "/icons/logo.svg",
      },
      excerpt:
        "Electrical contractors face unique documentation challenges. Discover how trade-specific templates with built-in code compliance checks are helping electricians win more bids with less effort.",
      image: "/competitive.jpg",
      tags: ["Electrical", "Templates"],
      readTime: "5 min read",
      link: "#",
    },
    {
      title: "Client Communication Masterclass: From Proposal to Final Payment",
      date: "April 20, 2025",
      author: {
        name: "Simple ProjeX Admin",
        role: "Platform Team",
        avatar: "/icons/logo.svg",
      },
      excerpt:
        "The way you communicate with clients can make or break your projects. This comprehensive guide shows you exactly how to structure your client communications for maximum clarity and satisfaction.",
      image: "/contractors.png",
      tags: ["Client Relations", "Best Practices"],
      readTime: "10 min read",
      link: "#",
    },
  ];

  // Carousel state
  const [current, setCurrent] = useState(0);
  const { theme } = useTheme();

  const prevPost = () =>
    setCurrent((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  const nextPost = () =>
    setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));

  return (
    <section
      id="blog"
      className={`py-24 relative overflow-hidden ${
        theme === "dark" ? "bg-[#191919] text-white" : "bg-white text-black"
      }`}
    >
      {/* Abstract background elements */}
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          theme === "dark" ? "bg-red-900/20" : "bg-red-900/10"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          theme === "dark" ? "bg-red-900/10" : "bg-red-900/5"
        }`}
      ></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge
              variant="outline"
              className={`mb-4 font-medium ${
                theme === "dark"
                  ? "text-red-400 border-red-900/30"
                  : "text-red-400 border-red-900/30"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
              <span>INDUSTRY INSIGHTS</span>
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Latest from our <span className="text-red-500">Experts</span>
            </h2>

            <p
              className={`text-lg max-w-2xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Practical advice and insights to help you stay ahead in the
              rapidly evolving world of project management.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-6 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${
                theme === "dark"
                  ? "border-gray-700 text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-900"
                  : "border-gray-800 text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-900"
              }`}
              onClick={prevPost}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous post</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${
                theme === "dark"
                  ? "border-gray-700 text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-900"
                  : "border-gray-800 text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-900"
              }`}
              onClick={nextPost}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next post</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Featured Post */}
          <Card
            className={`overflow-hidden hover:border-red-900/50 transition-all duration-300 group ${
              theme === "dark"
                ? "bg-gradient-to-br from-[#23272e] to-[#191919] border-gray-700 text-white"
                : "bg-gradient-to-br from-gray-200 to-white border-gray-800 text-black"
            }`}
          >
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <img
                src={posts[current].image || "/placeholder.svg"}
                alt={posts[current].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-red-600/90 hover:bg-red-700 text-white border-none">
                  Featured
                </Badge>
              </div>
            </div>

            <CardHeader className="relative z-20 -mt-14 pb-0">
              <div className="flex flex-wrap gap-2 mb-3">
                {posts[current].tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={`backdrop-blur-sm ${
                      theme === "dark"
                        ? "bg-black/50 text-white border-gray-700"
                        : "bg-black/50 text-white border-gray-700"
                    }`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <CardTitle
                className={`text-2xl md:text-3xl font-bold group-hover:text-red-400 transition-colors ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {posts[current].title}
              </CardTitle>

              <div
                className={`flex items-center gap-2 text-sm mt-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-800"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{posts[current].readTime}</span>
                <span
                  className={`w-1 h-1 rounded-full ${
                    theme === "dark" ? "bg-gray-500" : "bg-gray-800"
                  }`}
                ></span>
                <span>{posts[current].date}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-800"
                }`}
              >
                {posts[current].excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={posts[current].author.avatar || "/icons/logo.svg"}
                    />
                    <AvatarFallback
                      className={`bg-red-900 ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {posts[current].author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {posts[current].author.name}
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      {posts[current].author.role}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="text-red-400 gap-1 group/btn hover:underline"
                  asChild
                >
                  <a href={posts[current].link}>
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Post List */}
          <div className="space-y-6">
            {posts
              .filter((_, i) => i !== current)
              .slice(0, 3)
              .map((post, idx) => (
                <Card
                  key={idx}
                  className={`overflow-hidden hover:border-red-900/50 transition-all duration-300 group flex ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-[#23272e] to-[#191919] border-gray-700 text-white"
                      : "bg-gradient-to-br from-gray-200 to-white border-gray-800 text-black"
                  }`}
                >
                  <div className="w-1/3 relative overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80"></div>
                  </div>

                  <div className="w-2/3 p-4">
                    <div
                      className={`flex items-center gap-2 text-xs mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      <Badge
                        variant="outline"
                        className={`bg-transparent text-red-400 border-red-900/30 text-xs px-2 py-0`}
                      >
                        {post.tags[0]}
                      </Badge>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3
                      className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {post.title}
                    </h3>

                    <p
                      className={`text-sm line-clamp-2 mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={post.author.avatar || "/icons/logo.svg"}
                          />
                          <AvatarFallback
                            className={`bg-red-900 text-xs ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {post.author.name}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-transparent p-0 h-auto"
                        asChild
                      >
                        <a href={post.link}>
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

            <div className="flex justify-center mt-8">
              <Button
                className={`border text-red-400 hover:bg-red-900 hover:text-white ${
                  theme === "dark"
                    ? "bg-transparent border-red-900/50"
                    : "bg-transparent border-red-900/50"
                }`}
                asChild
              >
                <a href="#">
                  <span>View All Blogs</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div
          className={`mt-20 border rounded-xl p-8 relative overflow-hidden shadow-sm ${
            theme === "dark"
              ? "bg-gradient-to-r from-[#23272e] via-[#191919] to-[#23272e] border-gray-700"
              : "bg-gradient-to-r from-white via-gray-50 to-white border-gray-200"
          }`}
        >
          <div
            className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none ${
              theme === "dark" ? "bg-red-900/20" : "bg-red-100"
            }`}
          ></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h3
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Stay ahead of the curve
              </h3>
              <p
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                Get the latest industry insights, tips, and exclusive content
                delivered straight to your inbox.
              </p>
            </div>

            <form className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className={`placeholder-gray-400 focus:border-red-400 focus:ring-red-100 ${
                  theme === "dark"
                    ? "bg-[#23272e] border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
              <Button className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap shadow-md">
                Subscribe Now
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FQASection() {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const questions = [
    {
      question: "How does Simple ProjeX work?",
      answer:
        "Simple ProjeX is a cloud-based project management platform that offers templates, automation, and collaboration tools tailored for construction professionals.",
    },
    {
      question: "Is Simple ProjeX suitable for all trades?",
      answer:
        "Yes, Simple ProjeX provides specialized templates and features for various trades, including electrical, plumbing, and general contracting.",
    },
    {
      question: "Can I customize the templates?",
      answer:
        "Absolutely! You can easily modify any template to fit your specific project needs.",
    },
  ];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const currentIndex = prev === null ? -1 : prev;
        return currentIndex === questions.length - 1 ? 0 : currentIndex + 1;
      });
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, hasMounted, questions.length]);

  const handleUserSelect = (idx: number) => {
    setActiveIndex(idx);
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => setIsPaused(false), 1000);
  };

  return (
    <section
      id="faq"
      className={`py-24 relative overflow-hidden ${
        theme === "dark" ? "bg-[#191919] text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          theme === "dark" ? "bg-red-900/20" : "bg-red-900/10"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          theme === "dark" ? "bg-red-900/10" : "bg-red-900/5"
        }`}
      ></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge
              variant="outline"
              className={`mb-4 font-medium ${
                theme === "dark"
                  ? "text-red-400 border-red-900/30"
                  : "text-red-400 border-red-900/30"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
              <span>FAQ</span>
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Frequently Asked <span className="text-red-500">Questions</span>
            </h2>

            <p
              className={`text-lg max-w-xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Have questions? We have answers! Check out our most frequently
              asked questions below.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((item, idx) => (
            <Card
              key={idx}
              className={`overflow-hidden hover:border-red-900/50 transition-all duration-300 group ${
                theme === "dark"
                  ? `bg-gradient-to-br from-[#23272e] to-[#191919] border-gray-700 text-white`
                  : `bg-gradient-to-br from-gray-100 to-white border-gray-800 text-black`
              } ${activeIndex === idx ? "border-red-900" : ""}`}
              onClick={() => handleUserSelect(idx)}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-start gap-4">
                <div
                  className={`p-2 rounded-full ${
                    activeIndex === idx
                      ? "bg-red-100"
                      : theme === "dark"
                      ? "bg-[#23272e]"
                      : "bg-gray-100"
                  } flex items-center justify-center`}
                >
                  {activeIndex === idx ? (
                    <ChevronUp className="h-6 w-6 text-red-600" />
                  ) : (
                    <ChevronDown
                      className={`h-6 w-6 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                  )}
                </div>
                <div>
                  <CardTitle
                    className={`text-xl transition-colors duration-300 ${
                      activeIndex === idx ? "text-red-600" : ""
                    }`}
                  >
                    {item.question}
                  </CardTitle>
                </div>
              </CardHeader>
              {activeIndex === idx && (
                <CardContent className="p-4 pt-0 pl-16">
                  <p
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }
                  >
                    {item.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button
            className={`bg-transparent border border-red-900/50 text-red-400 hover:bg-red-900 hover:text-white ${
              theme === "dark" ? "" : ""
            }`}
            asChild
          >
            <a href="#">
              <span>View All FAQs</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={`py-12 border-t ${
        theme === "dark"
          ? "bg-[#191919] text-white border-gray-800"
          : "bg-white text-black border-gray-300"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-1">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <img
                src={
                  theme === "dark" ? "/icons/logo-white.png" : "/icons/logo.svg"
                }
                alt="Simple ProjeX Logo"
                width={32}
                height={32}
                className="transition-transform duration-300 scale-75"
              />
            </div>
            <span className="font-bold text-xl">Simple ProjeX</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className={`transition-colors hover:underline ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Features
            </a>
            <a
              href="#"
              className={`transition-colors hover:underline ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Blog
            </a>
            <a
              href="#"
              className={`transition-colors hover:underline ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Support
            </a>
            <a
              href="#"
              className={`transition-colors hover:underline ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Privacy
            </a>
            <a
              href="#"
              className={`transition-colors hover:underline ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Terms
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full border-1 transition-colors ${
                theme === "dark"
                  ? "border-gray-700 text-white hover:text-red-600 hover:border-red-600"
                  : "border-gray-900 text-black hover:text-red-600 hover:border-red-600"
              }`}
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full border-1 transition-colors ${
                theme === "dark"
                  ? "border-gray-700 text-white hover:text-red-600 hover:border-red-600"
                  : "border-gray-900 text-black hover:text-red-600 hover:border-red-600"
              }`}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className={`mt-2 pt-8 text-center text-sm ${
            theme === "dark" ? "text-gray-500" : "text-gray-500"
          }`}
        >
          &copy; 2025 Simple ProjeX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
