"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowUpRight,
  ExternalLink,
  Ruler,
  HardHat,
  Clock,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Inter, Oswald } from "next/font/google"; // Replace local font with Google Fonts

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@/components/shared";
import { Input } from "@/components/shared";
import Navbar from "./components/navbar";

// Use Google Fonts instead of local fonts
const inter = Inter({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"] });

// Define types to fix TypeScript errors
interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

interface Industry {
  title: string;
  image: string;
  description: string;
}

export default function LandingPage() {
  // Animation preference detection
  const prefersReducedMotion = useReducedMotion();

  // Scroll-based animation
  const { scrollY } = useScroll();

  // State for industry carousel
  const [currentIndustry, setCurrentIndustry] = useState(0);
  const [hoveredIndustry, setHoveredIndustry] = useState<number | null>(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [activeVisibleIndustry, setActiveVisibleIndustry] = useState(0);
  const industriesRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showVideo, setShowVideo] = useState(false);
  const [current, setCurrent] = useState(0);

  // Blog modal state
  const [openBlogIndex, setOpenBlogIndex] = useState<number | null>(null);

  // Blog posts with full content
  const posts = [
    {
      title: "How Simple ProjeX Is Revolutionizing Construction Proposals",
      date: "May 20, 2025",
      author: {
        name: "Simple ProjeX Team",
        role: "Product Team",
        avatar: "/icons/logo.svg",
      },
      excerpt:
        "Discover how Simple ProjeX empowers contractors with industry-specific templates, real-time collaboration, and digital signatures—making proposal creation faster, easier, and more professional.",
      image: "https://i.ibb.co/cKC6qtMD/Empowerment.jpg",
      tags: ["Product Update", "Features"],
      readTime: "5 min read",
      content: (
        <>
          <h2 className="text-2xl font-bold mb-4">
            How Simple ProjeX Is Revolutionizing Construction Proposals
          </h2>
          <p>
            In the fast-paced world of construction, time is money. Simple
            ProjeX is designed to help contractors and builders create
            professional proposals in minutes, not hours. With industry-specific
            templates, real-time collaboration, and digital signatures, you can
            streamline your workflow and impress your clients.
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>
              Industry-specific templates for electrical, plumbing, ADU, and
              more
            </li>
            <li>Real-time collaboration with your team and clients</li>
            <li>Secure digital signatures for faster approvals</li>
          </ul>
          <p>
            Join thousands of professionals who have transformed their proposal
            process with Simple ProjeX!
          </p>
        </>
      ),
    },
    {
      title: "Customer Success: 3 Ways Our Users Win More Projects",
      date: "May 14, 2025",
      author: {
        name: "Simple ProjeX Admin",
        role: "Customer Success",
        avatar: "/icons/logo.svg",
      },
      excerpt:
        "See how real contractors are saving hours each week, improving win rates, and impressing clients with Simple ProjeX. Read their stories and learn how you can do the same.",
      image: "https://i.ibb.co/zVWcqPwk/Costumer-Success.jpg",
      tags: ["Case Study", "Success"],
      readTime: "7 min read",
      content: (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Customer Success: 3 Ways Our Users Win More Projects
          </h2>
          <ol className="list-decimal pl-6 my-4">
            <li>
              <b>Faster Proposals:</b> Automated templates cut proposal creation
              time by 60%.
            </li>
            <li>
              <b>Higher Win Rates:</b> Professional, branded proposals help
              users stand out.
            </li>
            <li>
              <b>Client Satisfaction:</b> Real-time updates and e-signatures
              keep clients happy and informed.
            </li>
          </ol>
          <p>
            Read more stories from our community and see how you can achieve
            similar results!
          </p>
        </>
      ),
    },
    {
      title: "Why Industry-Specific Templates Matter for Your Business",
      date: "May 7, 2025",
      author: {
        name: "Simple ProjeX Team",
        role: "Platform Insights",
        avatar: "/icons/logo.svg",
      },
      excerpt:
        "Generic proposals don’t cut it. Learn how our tailored templates for electrical, plumbing, and ADU builders help you stand out and win more bids.",
      image: "https://i.ibb.co/6JtKtVyr/Platform-Insights.jpg",
      tags: ["Templates", "Best Practices"],
      readTime: "6 min read",
      content: (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Why Industry-Specific Templates Matter for Your Business
          </h2>
          <p>
            Every trade is different. That's why Simple ProjeX offers templates
            tailored to your specialty—whether you're an electrician, plumber,
            or ADU builder.
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Meet industry standards and compliance</li>
            <li>Highlight your expertise</li>
            <li>Win more bids with targeted proposals</li>
          </ul>
          <p>
            Upgrade your business with templates that speak your clients'
            language.
          </p>
        </>
      ),
    },
    {
      title: "From Estimate to E-Signature: The Simple ProjeX Workflow",
      date: "April 28, 2025",
      author: {
        name: "Simple ProjeX Admin",
        role: "Product Team",
        avatar: "/icons/logo.svg",
      },
      excerpt:
        "Walk through a typical project lifecycle in Simple ProjeX—from fast, accurate estimates to client-ready proposals and secure digital signatures—all in one place.",
      image: "https://i.ibb.co/8gzBLxNq/Esign.png",
      tags: ["Workflow", "How-To"],
      readTime: "8 min read",
      content: (
        <>
          <h2 className="text-2xl font-bold mb-4">
            From Estimate to E-Signature: The Simple ProjeX Workflow
          </h2>
          <ol className="list-decimal pl-6 my-4">
            <li>
              <b>Estimate:</b> Use our cost estimation tools for fast, accurate
              quotes.
            </li>
            <li>
              <b>Proposal:</b> Customize industry-specific templates for your
              client.
            </li>
            <li>
              <b>E-Signature:</b> Get client approval instantly with secure
              digital signatures.
            </li>
          </ol>
          <p>Experience a seamless workflow from start to finish!</p>
        </>
      ),
    },
  ];

  const prevPost = () =>
    setCurrent((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  const nextPost = () =>
    setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (industriesRef.current) {
      const { left, top, width, height } =
        industriesRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setMousePosition({ x, y });
    }
  };

  // Optimize industry change to prevent the blank flash
  useEffect(() => {
    // Set active visible industry with short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setActiveVisibleIndustry(currentIndustry);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentIndustry]);

  // Industries data with additional images for explosive effect
  const industries: Industry[] = [
    {
      title: "Electrical Contractors",
      image:
        "https://www.austintec.com/wp-content/uploads/2024/05/what-do-electrical-engineers-do.jpg",
      description:
        "Detailed electrical diagrams, code compliance checklists, and material specifications.",
    },
    {
      title: "Plumbing Professionals",
      image:
        "https://www.icominc.com/wp-content/uploads/2021/08/TA9Q9bV3Z81nZRooviZz51Y4bpnXIdBt1623180634.jpg",
      description:
        "Pipe layouts, fixture specifications, and water system diagrams with cost breakdowns.",
    },
    {
      title: "ADU Builders",
      image:
        "https://www.chase.com/content/dam/unified-assets/photography/articles/primary/mortgage/seo_accessory-dwelling-unit-adu_12152023.jpg",
      description:
        "Complete ADU project proposals with floor plans, permits, and timeline projections.",
    },
  ];

  // Define pricing plans with proper typing
  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for small contractors and individual professionals",
      features: [
        "5 proposals per month",
        "Basic templates",
        "Cost estimation tools",
        "Email support",
      ],
    },
    {
      name: "Professional",
      price: "$99",
      description: "Ideal for growing construction businesses",
      features: [
        "Unlimited proposals",
        "All industry templates",
        "Advanced cost estimation",
        "Client management",
        "Digital signatures",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      description: "For established construction companies with multiple teams",
      features: [
        "Everything in Professional",
        "Team collaboration tools",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "Training sessions",
      ],
    },
  ];

  // Controls for industry carousel
  const nextIndustry = () => {
    if (!isLoading && allImagesLoaded) {
      setCurrentIndustry((prev) =>
        prev === industries.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevIndustry = () => {
    if (!isLoading && allImagesLoaded) {
      setCurrentIndustry((prev) =>
        prev === 0 ? industries.length - 1 : prev - 1
      );
    }
  };

  // Auto-advance carousel with pause on hover
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused && !isLoading && allImagesLoaded) {
      const timer = setTimeout(() => {
        nextIndustry();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndustry, isPaused, isLoading, allImagesLoaded]);

  // Improved image preloading for performance
  useEffect(() => {
    const preloadImages = async () => {
      try {
        // Preload all images simultaneously
        const imagePromises = industries.map((industry) => {
          return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.src = industry.image;
            img.onload = resolve;
            img.onerror = reject;
          });
        });

        await Promise.all(imagePromises);
        setIsLoading(false);
        setAllImagesLoaded(true);
      } catch (error) {
        console.error("Failed to preload images:", error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [industries]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Construction-themed section header component for consistent styling
  const SectionHeader = ({
    badge,
    title,
    description,
  }: {
    badge: string;
    title: string;
    description: string;
  }) => (
    <motion.div
      className="mb-12 sm:mb-16 md:mb-20 text-center max-w-3xl mx-auto px-4 sm:px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className={`${oswald.className} inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium mb-3 sm:mb-4`}
        style={{
          backgroundColor: "hsla(0, 85%, 30%, 0.1)",
          color: "hsl(0, 85%, 30%)",
          border: "1px dashed hsl(0, 85%, 30%)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
        ></span>
        {badge}
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
        ></span>
      </div>

      <h2
        className={`${oswald.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 uppercase leading-tight`}
        style={{ color: "hsl(20, 10%, 15%)" }}
      >
        {title}
      </h2>

      <div className="flex justify-center items-center mb-4 sm:mb-6">
        <div
          className="h-0.5 w-8 sm:w-12 md:w-16"
          style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
        ></div>
        <div
          className="h-2 w-2 sm:h-3 sm:w-3 mx-2 transform rotate-45"
          style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
        ></div>
        <div
          className="h-0.5 w-8 sm:w-12 md:w-16"
          style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
        ></div>
      </div>

      <p
        className="text-base sm:text-lg md:text-xl leading-relaxed"
        style={{ color: "hsl(20, 10%, 40%)" }}
      >
        {description}
      </p>
    </motion.div>
  );

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
        {/* Hero section (keeping as requested) */}
        <section
          ref={heroRef}
          className="relative p-4 py-24 min-h-[81vh] overflow-hidden"
          style={{
            backgroundColor: "hsl(0, 85%, 30%)", // Primary red color
          }}
        >
          {/* Decorative elements for maximalist style */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large geometric shapes with improved animations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl"
              style={{ backgroundColor: "hsla(40, 100%, 50%, 0.2)" }}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.3, delay: 0.2, ease: "easeOut" }}
              className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl"
              style={{ backgroundColor: "hsla(30, 50%, 30%, 0.2)" }}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.6, delay: 0.4, ease: "easeOut" }}
              className="absolute bottom-0 left-1/3 w-[40rem] h-[40rem] rounded-full bg-secondary/10 blur-3xl"
              style={{ backgroundColor: "hsla(40, 100%, 50%, 0.1)" }}
            ></motion.div>

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            {/* Diagonal lines with subtle animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="absolute top-0 left-0 right-0 h-full w-full overflow-hidden"
            >
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.2 }}
                className="absolute top-1/4 left-0 w-full h-[2px] bg-white/10 -rotate-[30deg] transform origin-left"
              ></motion.div>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.4 }}
                className="absolute top-1/3 left-0 w-full h-[1px] bg-white/10 rotate-[20deg] transform origin-left"
              ></motion.div>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.6 }}
                className="absolute top-2/3 left-0 w-full h-[3px] bg-white/5 -rotate-[10deg] transform origin-left"
              ></motion.div>
            </motion.div>

            {/* Construction-themed elements with subtle animations */}
            <motion.div
              initial={{ opacity: 0, rotate: 35 }}
              animate={{ opacity: 1, rotate: 45 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="absolute top-20 right-20 w-40 h-40 border-8 border-white/10"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 12 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="absolute bottom-40 left-20 w-20 h-20 border-4 border-white/10"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              className="absolute top-1/2 left-1/2 w-60 h-60 border-2 border-dashed border-white/10 rounded-full"
            ></motion.div>

            {/* Gradient overlay for smooth transition to white */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          {/* Hero content - centered vertically & horizontally */}
          <div className="container relative z-10 h-full flex items-center justify-center mx-auto">
            <div className="grid gap-16 md:grid-cols-2 items-center py-16 text-center md:text-left">
              {/* Left column - Value proposition */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur"
                >
                  Introducing Simple ProjeX
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  Build Better
                  <span
                    className="block"
                    style={{ color: "hsl(40, 100%, 50%)" }}
                  >
                    Proposals.
                  </span>
                  <span className="block mt-2">Win More</span>
                  <span
                    className="block"
                    style={{ color: "hsl(40, 100%, 50%)" }}
                  >
                    Projects.
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="max-w-[600px] text-xl text-white/80 mx-auto md:mx-0"
                >
                  The professional proposal builder designed specifically for
                  construction industry professionals.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                >
                  <div className="flex-1 max-w-md">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="rounded-full bg-white hover:bg-white/90 text-lg px-8 h-12"
                    style={{ color: "hsl(0, 85%, 30%)" }}
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* ENHANCED: Image collage with staggered and interactive animations */}
              <div className="relative">
                <motion.div
                  className="relative h-[550px] w-full"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  onHoverStart={() => setIsPaused(true)}
                  onHoverEnd={() => setIsPaused(false)}
                >
                  {/* Main image */}
                  <motion.div
                    className="absolute top-0 left-0 w-3/4 h-3/5 rounded-lg overflow-hidden border-4 border-white shadow-xl z-30 transform rotate-2"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: [2, 2.5, 2],
                            transition: {
                              duration: 8,
                              repeat: Infinity,
                              repeatType: "reverse",
                            },
                          }
                    }
                  >
                    <Image
                      src="https://i.ibb.co/S7m0zKk2/Proposal-Designss.webp"
                      alt="Proposal Design"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Secondary images */}
                  <motion.div
                    className="absolute top-1/4 right-0 w-2/5 h-2/5 rounded-lg overflow-hidden border-4 border-white shadow-xl z-20 transform -rotate-3"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: [-3, -4, -3],
                            transition: {
                              duration: 7,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: 0.5,
                            },
                          }
                    }
                  >
                    <Image
                      src="https://i.ibb.co/v6nbxDyP/Architecture-Design.webp"
                      alt="Architecture Design"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Third images */}
                  <motion.div
                    className="absolute bottom-0 right-1/4 w-2/5 h-2/5 rounded-lg overflow-hidden border-4 border-white shadow-xl z-20 transform rotate-6"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: [6, 7, 6],
                            y: [0, -5, 0],
                            transition: {
                              duration: 9,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: 1,
                            },
                          }
                    }
                  >
                    <Image
                      src="https://i.ibb.co/qYxGRxHJ/Builder.webp"
                      alt="Builder"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Fourth image */}
                  <motion.div
                    className="absolute bottom-10 left-10 w-2/5 h-1/3 rounded-lg overflow-hidden border-4 border-white shadow-xl z-10 transform -rotate-6"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: [-6, -7.5, -6],
                            y: [0, 5, 0],
                            transition: {
                              duration: 8,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: 1.5,
                            },
                          }
                    }
                  >
                    <Image
                      src="https://i.ibb.co/nNqvcPbp/Proposal-Builder.webp"
                      alt="Proposal Builder"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Fifth image */}
                  <motion.div
                    className="absolute top-1/3 right-1/4 w-1/3 h-1/4 rounded-lg overflow-hidden border-4 border-white shadow-xl z-0 transform rotate-12"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: [12, 14, 12],
                            transition: {
                              duration: 10,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: 2,
                            },
                          }
                    }
                  >
                    <Image
                      src="https://i.ibb.co/v4sVw6yq/Poject-Management.webp"
                      alt="Project Management"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Play button overlay with improved animations */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                    <motion.button
                      className="group relative"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowVideo(true)}
                      style={{
                        outline: "none",
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        cursor: "pointer",
                      }}
                      aria-label="Watch Demo"
                    >
                      {/* Outer rings with improved animation */}
                      <motion.div
                        className="absolute -inset-10 rounded-full border-2 border-white/20 opacity-20"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.2, 0.3, 0.2],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      ></motion.div>
                      <motion.div
                        className="absolute -inset-7 rounded-full border border-white/40"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: 0.5,
                        }}
                      ></motion.div>

                      {/* Button background with enhanced hover effect */}
                      <motion.div
                        className="relative bg-white/90 backdrop-blur-sm rounded-full p-5 group-hover:bg-white transition-all duration-300 shadow-lg"
                        whileHover={{
                          boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        <Play
                          className="h-10 w-10 text-primary"
                          style={{ color: "hsl(0, 85%, 30%)" }}
                        />
                      </motion.div>

                      {/* Label with animation */}
                      <motion.span
                        className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-primary font-bold shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        style={{ color: "hsl(0, 85%, 30%)" }}
                      >
                        Watch Demo
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stats bar - moved slightly up to overlap with gradient */}
          <motion.div
            className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-md mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="container py-6 mx-auto">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {(
                  [
                    { label: "Contractors", value: "10,000+" },
                    { label: "Proposals Created", value: "250,000+" },
                    { label: "Win Rate", value: "85%" },
                    { label: "Time Saved", value: "75%" },
                  ] as const
                ).map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index + 1.6 }}
                  >
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* REVAMPED: Feature section with modern card design and construction typography */}
        <section
          id="features"
          className="py-32"
          style={{
            background:
              "linear-gradient(to bottom, hsl(0, 0%, 100%), hsl(20, 10%, 96%))",
          }}
        >
          <div className="container px-4 mx-auto max-w-7xl">
            <SectionHeader
              badge="Features"
              title="Build Your Success"
              description="Our powerful tools are designed specifically for construction professionals to create stunning proposals that get approved faster."
            />

            {/* Feature cards with construction-themed UI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {(
                [
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <path d="M12 12h.01" />
                        <path d="M17 12h.01" />
                        <path d="M7 12h.01" />
                      </svg>
                    ),
                    title: "Industry-Specific Templates",
                    description:
                      "Pre-built templates designed for electrical, plumbing, ADU construction and more.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    ),
                    title: "Cost Estimation Tools",
                    description:
                      "Accurate cost calculations with built-in material and labor databases.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    ),
                    title: "Project Visualization",
                    description:
                      "Include 3D renderings and visual mockups to help clients see the finished project.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M12 2H2v10h10V2z" />
                        <path d="M22 12h-10v10h10V12z" />
                        <path d="M12 12H2v10h10V12z" />
                        <path d="M22 2h-10v10h10V2z" />
                      </svg>
                    ),
                    title: "Modular Components",
                    description:
                      "Mix and match proposal sections to create the perfect document for each client.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                    title: "Client Management",
                    description:
                      "Keep track of all your clients and their project requirements in one place.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                    title: "Digital Signatures",
                    description:
                      "Secure e-signature capabilities for faster project approvals and contract signing.",
                  },
                ] as const
              ).map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="p-8">
                    <div className="bg-primary/10 p-3 rounded-xl w-fit mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                  <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                    <Link
                      href="#"
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                    >
                      Learn more
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PERFORMANCE-OPTIMIZED: Industry section with improved carousel */}
        <section
          id="industries"
          className="py-32 relative overflow-hidden"
          style={{ backgroundColor: "hsl(20, 10%, 96%)" }}
        >
          <div className="container px-4 mx-auto relative z-10 max-w-7xl">
            <SectionHeader
              badge="Industries"
              title="Built For Your Work"
              description="We understand the unique requirements of different construction specialties."
            />

            {/* OPTIMIZED: Performance-enhanced 3D Carousel */}
            <div
              ref={industriesRef}
              className="relative max-w-6xl mx-auto"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Carousel header with interactive elements */}
              <motion.div
                className="flex justify-between items-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3
                  className={`${oswald.className} text-3xl font-bold uppercase`}
                  style={{ color: "hsl(20, 10%, 15%)" }}
                >
                  Industry Solutions
                </h3>
                <div className="flex items-center gap-6">
                  <motion.div
                    className="flex space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {industries.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndustry(idx)}
                        className="relative overflow-hidden rounded-md"
                        style={{
                          width: idx === currentIndustry ? "2.5rem" : "0.5rem",
                          height: "0.5rem",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-md"
                          style={{
                            backgroundColor:
                              idx === currentIndustry
                                ? "hsl(0, 85%, 30%)"
                                : "hsla(0, 85%, 30%, 0.3)",
                          }}
                          whileHover={{ backgroundColor: "hsl(0, 85%, 40%)" }}
                        />
                        {idx === currentIndustry && (
                          <motion.div
                            className="absolute inset-0 origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: 5,
                              ease: "linear",
                              repeat: 1,
                              repeatDelay: 0,
                            }}
                            style={{
                              backgroundColor: "hsla(40, 100%, 50%, 0.5)",
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>

                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevIndustry}
                      disabled={isLoading || !allImagesLoaded}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{
                        backgroundColor: "hsl(0, 85%, 30%)",
                        color: "hsl(0, 0%, 100%)",
                        boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.3)",
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextIndustry}
                      disabled={isLoading || !allImagesLoaded}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{
                        backgroundColor: "hsl(0, 85%, 30%)",
                        color: "hsl(0, 0%, 100%)",
                        boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.3)",
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* OPTIMIZED: Performance-improved 3D carousel with CSS caching */}
              <div
                className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  backgroundColor: "hsl(20, 10%, 90%)", // Background color while loading
                  perspective: "1000px",
                }}
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-12 h-12 rounded-full border-4 border-t-transparent"
                      style={{
                        borderColor: "hsla(0, 85%, 30%, 0.3)",
                        borderTopColor: "transparent",
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Preloaded background images (hidden) for performance */}
                    <div className="hidden">
                      {industries.map((industry, idx) => (
                        <Image
                          key={`preload-${idx}`}
                          src={industry.image}
                          alt=""
                          width={10}
                          height={10}
                          priority={true}
                        />
                      ))}
                    </div>

                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        opacity: allImagesLoaded ? 1 : 0,
                        transform: `rotateY(${
                          (mousePosition.x - 0.5) * 5
                        }deg) rotateX(${(0.5 - mousePosition.y) * 5}deg)`,
                      }}
                    >
                      {industries.map((industry, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                            index === activeVisibleIndustry
                              ? "opacity-100 z-20"
                              : "opacity-0 z-10"
                          }`}
                        >
                          {/* Image - Always rendered but hidden with opacity for performance */}
                          <div className="absolute inset-0 z-10">
                            <Image
                              src={industry.image}
                              alt={industry.title}
                              fill
                              priority={index === 0}
                              className="object-cover"
                            />

                            {/* Static geometric decorative elements */}
                            <div
                              className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full opacity-60 mix-blend-overlay"
                              style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
                            />

                            <div
                              className="absolute -left-20 top-40 w-40 h-40 rounded-full opacity-40 mix-blend-overlay"
                              style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
                            />

                            {/* Animated patterns using CSS instead of JavaScript for better performance */}
                            <div
                              className="absolute inset-0 mix-blend-overlay opacity-20 bg-animate-pattern"
                              style={{
                                backgroundImage:
                                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                              }}
                            />
                          </div>

                          {/* Content overlay - Always rendered but hidden with opacity for performance */}
                          <div
                            className="absolute inset-0 z-20 flex flex-col justify-end p-12 lg:p-16"
                            style={{
                              background:
                                "linear-gradient(to right, hsla(20, 10%, 15%, 0.9), hsla(20, 10%, 15%, 0.7) 60%, transparent)",
                            }}
                          >
                            <div className="max-w-2xl">
                              <div
                                className={`inline-block mb-6 px-4 py-1.5 text-sm font-medium rounded-full backdrop-blur-md ${oswald.className}`}
                                style={{
                                  backgroundColor: "hsla(40, 100%, 50%, 0.2)",
                                  color: "hsl(40, 100%, 50%)",
                                }}
                              >
                                {industry.title}
                              </div>

                              <h3
                                className={`${oswald.className} text-5xl lg:text-6xl font-bold mb-6 uppercase`}
                                style={{ color: "hsl(0, 0%, 100%)" }}
                              >
                                <span>Solutions for </span>
                                <span
                                  className="relative inline-block"
                                  style={{ color: "hsl(40, 100%, 50%)" }}
                                >
                                  {industry.title}
                                  <div
                                    className="absolute -bottom-3 left-0 h-1 w-full rounded-full animate-expand-right"
                                    style={{
                                      backgroundColor: "hsl(40, 100%, 50%)",
                                    }}
                                  />
                                </span>
                              </h3>

                              <p
                                className="text-2xl mb-10 max-w-lg"
                                style={{ color: "hsla(0, 0%, 100%, 0.9)" }}
                              >
                                {industry.description}
                              </p>

                              <div className="flex flex-wrap gap-5">
                                <Button
                                  className="rounded-full text-lg px-8 py-6 shadow-xl relative overflow-hidden group"
                                  style={{
                                    backgroundColor: "hsl(40, 100%, 50%)",
                                    color: "hsl(20, 10%, 15%)",
                                  }}
                                >
                                  <span className="absolute inset-0 w-0 bg-gradient-hover-orange opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-500 ease-out"></span>
                                  <span className="relative z-10">
                                    View Solutions
                                  </span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="rounded-full text-lg px-8 py-6 relative overflow-hidden group"
                                  style={{
                                    borderColor: "hsla(0, 0%, 100%, 0.3)",
                                    borderWidth: "2px",
                                    color: "hsl(0, 0%, 100%)",
                                    backgroundColor: "transparent",
                                  }}
                                >
                                  <span className="absolute inset-0 w-0 bg-white/10 opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-500 ease-out"></span>
                                  <span className="relative z-10 flex items-center">
                                    Case Studies{" "}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                  </span>
                                </Button>
                              </div>
                            </div>

                            {/* Interactive floating elements - Static for better performance */}
                            <div
                              className="absolute top-10 right-12 flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-md"
                              style={{
                                backgroundColor: "hsla(0, 0%, 100%, 0.1)",
                              }}
                            >
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor: "hsl(40, 100%, 50%)",
                                }}
                              />
                              <span style={{ color: "hsl(0, 0%, 100%)" }}>
                                Industry-specific templates included
                              </span>
                            </div>
                          </div>

                          {/* Interactive floating elements - Static for better performance */}
                          <div className="absolute bottom-12 right-12 z-30">
                            <div
                              className="flex items-center px-5 py-3 rounded-full cursor-pointer hover:scale-105 transition-transform duration-300"
                              style={{
                                backgroundColor: "hsla(0, 0%, 100%, 0.95)",
                                boxShadow:
                                  "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              <span
                                className="font-medium mr-2"
                                style={{ color: "hsl(20, 10%, 15%)" }}
                              >
                                Scroll to explore
                              </span>
                              <div
                                className="h-8 w-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
                              >
                                <div className="animate-pulse-down">
                                  <ChevronRight
                                    className="h-5 w-5 rotate-90"
                                    style={{ color: "hsl(0, 0%, 100%)" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Industry thumbnails for quick navigation */}
              <motion.div
                className="flex space-x-4 mt-8 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {industries.map((industry, idx) => (
                  <motion.div
                    key={idx}
                    className="relative rounded-xl overflow-hidden cursor-pointer will-change-transform"
                    onClick={() =>
                      !isLoading && allImagesLoaded && setCurrentIndustry(idx)
                    }
                    onMouseEnter={() => setHoveredIndustry(idx)}
                    onMouseLeave={() => setHoveredIndustry(null)}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: "120px",
                      height: "80px",
                      border:
                        idx === currentIndustry
                          ? "3px solid hsl(0, 85%, 30%)"
                          : "3px solid transparent",
                      opacity: isLoading ? 0.5 : 1,
                    }}
                  >
                    {/* Using picture element for faster loading */}
                    <div className="absolute inset-0 bg-gray-200">
                      <Image
                        src={industry.image}
                        alt={industry.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor:
                          hoveredIndustry === idx || idx === currentIndustry
                            ? "hsla(0, 85%, 30%, 0.7)"
                            : "hsla(20, 10%, 15%, 0.7)",
                      }}
                    >
                      <p
                        className={`${oswald.className} text-xs font-medium text-center px-2 uppercase`}
                        style={{ color: "hsl(0, 0%, 100%)" }}
                      >
                        {industry.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* REVAMPED: Blog section with modern card design and construction typography */}
        <section
          id="blog"
          className="p-4 py-32 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(120deg, hsl(20, 10%, 96%) 60%, hsl(40, 100%, 97%) 100%)",
          }}
        >
          {/* SVG grid pattern overlay */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="blogGrid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="hsla(20, 10%, 90%, 0.7)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#blogGrid)" />
            </svg>
          </div>

          {/* Blurred colored blobs for depth */}
          <div className="absolute top-[-6rem] left-[-8rem] w-[32rem] h-[32rem] rounded-full bg-orange-400/20 blur-3xl z-0"></div>
          <div className="absolute bottom-[-8rem] right-[-6rem] w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-3xl z-0"></div>
          <div className="absolute top-1/2 left-1/2 w-[18rem] h-[18rem] rounded-full bg-yellow-300/10 blur-2xl z-0 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-orange-200/30 blur-2xl z-0"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Section Header */}
            <motion.div
              className="mb-12 sm:mb-16 md:mb-20 text-center max-w-3xl mx-auto px-4 sm:px-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                className={`${oswald.className} inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium mb-3 sm:mb-4`}
                style={{
                  backgroundColor: "hsla(0, 85%, 30%, 0.1)",
                  color: "hsl(0, 85%, 30%)",
                  border: "1px dashed hsl(0, 85%, 30%)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
                ></span>
                Blog
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
                ></span>
              </div>
              <h2
                className={`${oswald.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 uppercase leading-tight`}
                style={{ color: "hsl(20, 10%, 15%)" }}
              >
                INDUSTRY{" "}
                <span style={{ color: "hsl(0, 85%, 30%)" }}>INSIGHTS</span>
              </h2>
              <div className="flex justify-center items-center mb-4 sm:mb-6">
                <div
                  className="h-0.5 w-8 sm:w-12 md:w-16"
                  style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
                ></div>
                <div
                  className="h-2 w-2 sm:h-3 sm:w-3 mx-2 transform rotate-45"
                  style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
                ></div>
                <div
                  className="h-0.5 w-8 sm:w-12 md:w-16"
                  style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
                ></div>
              </div>
              <p
                className="text-base sm:text-lg md:text-xl leading-relaxed"
                style={{ color: "hsl(20, 10%, 40%)" }}
              >
                Practical advice and insights to help you stay ahead in the
                rapidly evolving world of project management.
              </p>
            </motion.div>

            {/* Blog Carousel Controls */}
            <div className="flex items-center gap-2 justify-center mb-12">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary/40 text-primary hover:text-white hover:bg-primary hover:border-primary"
                onClick={prevPost}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous post</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary/40 text-primary hover:text-white hover:bg-primary hover:border-primary"
                onClick={nextPost}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next post</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Featured Post */}
              <motion.div
                className="overflow-hidden group bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10"></div>
                  <img
                    src={posts[current].image || "/placeholder.svg"}
                    alt={posts[current].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="relative z-20 -mt-14 pb-0 px-8 pt-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {posts[current].tags.map((tag, i) => (
                      <span
                        key={i}
                        className="backdrop-blur-sm bg-primary/80 text-white border border-primary/30 rounded-full px-3 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">
                    {posts[current].title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm mt-3 text-gray-800">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{posts[current].readTime}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                    <span>{posts[current].date}</span>
                  </div>
                  <p className="mb-3 mt-4 text-gray-800">
                    {posts[current].excerpt}
                  </p>
                  <div className="flex flex-col md:p-3 sm:flex-row sm:items-center gap-3 sm:gap-4 w-full">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={
                            posts[current].author.avatar || "/icons/logo.svg"
                          }
                        />
                        <AvatarFallback className="bg-primary text-white">
                          {posts[current].author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col px-0 py-2 sm:p-0 items-start text-left">
                        <div className="font-medium text-black">
                          {posts[current].author.name}
                        </div>
                        <div className="text-xs text-gray-800">
                          {posts[current].author.role}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-primary gap-1 group/btn hover:underline sm:mt-0 w-full sm:w-auto"
                      onClick={() => setOpenBlogIndex(current)}
                    >
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Post List */}
              <div className="space-y-6">
                {posts
                  .filter((_, i) => i !== current)
                  .slice(0, 3)
                  .map((post, idx) => (
                    <motion.div
                      key={idx}
                      className="overflow-hidden group flex bg-white border border-gray-100 rounded-2xl shadow hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * idx }}
                    >
                      <div className="w-1/3 relative overflow-hidden">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/80"></div>
                      </div>
                      <div className="w-2/3 p-4">
                        <div className="flex items-center gap-2 text-xs mb-2 text-primary">
                          <span className="bg-transparent text-primary border border-primary/30 rounded-full px-2 py-0">
                            {post.tags[0]}
                          </span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm line-clamp-2 mb-3 text-gray-900">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={post.author.avatar || "/icons/logo.svg"}
                              />
                              <AvatarFallback className="bg-primary text-xs text-white">
                                {post.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-900">
                              {post.author.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-orange-500 hover:bg-transparent p-0 h-auto"
                            onClick={() =>
                              setOpenBlogIndex(idx >= current ? idx + 1 : idx)
                            }
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                <div className="flex justify-center mt-8">
                  <Button
                    className="border text-primary hover:bg-primary hover:text-white bg-transparent border-primary/50"
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
          </div>

          {/* Blog Modal */}
          <AnimatePresence>
            {openBlogIndex !== null && (
              <motion.div
                className="fixed p-4 md:p-0 inset-0 z-50 flex items-center justify-center bg-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                tabIndex={-1}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpenBlogIndex(null);
                }}
              >
                <motion.div
                  className="relative w-full max-w-2xl p-6 bg-white rounded-xl shadow-xl overflow-y-auto max-h-[90vh]"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  {/* Improved Close Button */}
                  <button
                    className="fixed z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-primary/90 hover:text-white text-gray-700 text-2xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={() => setOpenBlogIndex(null)}
                    aria-label="Close blog post"
                    tabIndex={0}
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      width={28}
                      height={28}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-7 h-7"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  <div className="mb-6">
                    <img
                      src={posts[openBlogIndex].image}
                      alt={posts[openBlogIndex].title}
                      className="w-full rounded-lg mb-4"
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={posts[openBlogIndex].author.avatar} />
                        <AvatarFallback>
                          {posts[openBlogIndex].author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {posts[openBlogIndex].author.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {posts[openBlogIndex].author.role}
                        </div>
                      </div>
                      <span className="ml-4 text-gray-400">
                        {posts[openBlogIndex].date}
                      </span>
                    </div>
                  </div>
                  <article className="prose max-w-none">
                    {posts[openBlogIndex].content}
                  </article>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ENHANCED: Pricing section with modern design and updated colors */}
        <section
          id="pricing"
          className="py-32 relative overflow-hidden"
          style={{ backgroundColor: "hsl(20, 10%, 96%)" }}
        >
          {/* Background patterns */}
          <div className="absolute inset-0 z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="hsla(20, 10%, 90%, 0.7)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container px-4 mx-auto relative z-10 max-w-7xl">
            <motion.div
              className="mb-20 text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                className="inline-block rounded-full px-4 py-1.5 text-sm font-medium mb-4"
                style={{
                  backgroundColor: "hsla(0, 85%, 30%, 0.1)",
                  color: "hsl(0, 85%, 30%)",
                }}
              >
                Pricing
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                style={{ color: "hsl(20, 10%, 15%)" }}
              >
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl" style={{ color: "hsl(20, 10%, 40%)" }}>
                Choose the plan that fits your business needs
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                    plan.highlighted
                      ? "bg-white border-2 border-primary shadow-lg shadow-primary/10 md:scale-105 z-10"
                      : "bg-white border border-gray-100 shadow-sm"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: plan.highlighted
                      ? "0 20px 30px -10px rgba(220, 38, 38, 0.2)"
                      : "0 20px 30px -10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1.5 text-sm font-medium">
                      Most Popular
                    </div>
                  )}

                  <div className={`p-8 ${plan.highlighted ? "pt-12" : ""}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="flex items-baseline mb-6">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="ml-2 text-gray-600">/month</span>
                    </div>

                    <Button
                      className={`w-full mb-8 py-6 rounded-xl text-base ${
                        plan.highlighted
                          ? "bg-primary hover:bg-primary/90 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      Get Started Now
                    </Button>

                    <div className="border-t border-gray-100 pt-6">
                      <p className="font-medium text-gray-700 mb-4">
                        Includes:
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle
                              className={`h-5 w-5 mt-0.5 ${
                                plan.highlighted
                                  ? "text-primary"
                                  : "text-gray-500"
                              }`}
                            />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ teaser */}
            <motion.div
              className="mt-20 mx-auto text-center max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">
                Have questions about our pricing?
              </h3>
              <p className="text-gray-600 mb-6">
                We're here to help you choose the right plan for your business
                needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900">
                  View FAQ
                </Button>
                <Button className="rounded-full bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700">
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* REDESIGNED: Call to action with modern 3D elements and updated colors */}
        <section
          className="py-32 relative overflow-hidden"
          style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
        >
          {/* 3D geometric shapes for visual interest */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{ backgroundColor: "hsl(0, 0%, 100%)" }}
            />
            <motion.div
              className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full"
              animate={{
                y: [0, 20, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              style={{ backgroundColor: "hsl(0, 0%, 100%)" }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
          </div>

          <div className="container px-4 mx-auto relative z-10 max-w-5xl">
            <motion.div
              className="bg-white/10 backdrop-blur-lg p-1 rounded-full inline-block mx-auto mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/10 backdrop-blur-lg px-6 py-1.5 rounded-full text-white text-sm font-medium">
                Ready to get started?
              </div>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-bold text-white text-center max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your Proposal Process Today
            </motion.h2>

            <motion.p
              className="text-xl text-white/80 text-center max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of construction professionals who are winning more
              projects with Simple ProjeX
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="rounded-xl py-6 px-8 bg-white text-primary hover:bg-white/90 text-lg w-full shadow-lg shadow-white/10"
              >
                Start Your Free Trial
              </Button>
              <Button
                size="lg"
                className="rounded-xl py-6 px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-lg w-full"
                onClick={() => setShowVideo(true)}
              >
                <Play className="h-5 w-5 mr-2" /> Watch Demo
              </Button>
            </motion.div>

            <motion.div
              className="mt-16 flex items-center justify-center gap-8 flex-wrap"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p className="text-white/60 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> No credit card required
              </p>
              <p className="text-white/60 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> 14-day free trial
              </p>
              <p className="text-white/60 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>

        {/* Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="relative w-full max-w-2xl p-4">
              <button
                className="absolute top-3 right-5 z-10 text-white text-2xl"
                onClick={() => setShowVideo(false)}
                aria-label="Close"
              >
                ×
              </button>
              <video
                src="/Demo_Video.mp4"
                controls
                autoPlay
                className="w-full rounded-lg shadow-lg bg-black"
              />
            </div>
          </div>
        )}
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
