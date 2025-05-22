"use client";
import React from "react";
import { Badge, Button } from "@/components/shared";
import { useTheme } from "@/components/contexts/theme-context";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const oswald = Oswald({ subsets: ["latin"] });

function IndustriesSection() {
  const { theme } = useTheme();
  const [currentIndustry, setCurrentIndustry] = useState(0);
  const [hoveredIndustry, setHoveredIndustry] = useState<number | null>(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [activeVisibleIndustry, setActiveVisibleIndustry] = useState(0);
  const industriesRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Industries data with additional images for explosive effect
  const industries = [
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
      className="mb-20 text-center max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className={`${oswald.className} inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-4`}
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
        className={`${oswald.className} text-4xl md:text-5xl font-bold tracking-tight mb-6 uppercase`}
        style={{ color: "hsl(20, 10%, 15%)" }}
      >
        {title}
      </h2>
      <div className="flex justify-center items-center mb-6">
        <div
          className="h-0.5 w-16"
          style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
        ></div>
        <div
          className="h-3 w-3 mx-2 transform rotate-45"
          style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
        ></div>
        <div
          className="h-0.5 w-16"
          style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
        ></div>
      </div>
      <p className="text-xl" style={{ color: "hsl(20, 10%, 40%)" }}>
        {description}
      </p>
    </motion.div>
  );

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

  // Optimize industry change to prevent the blank flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveVisibleIndustry(currentIndustry);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentIndustry]);

  // Improved image preloading for performance
  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all(
          industries.map((industry) => {
            return new Promise((resolve, reject) => {
              const img = new window.Image();
              img.src = industry.image;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
        setAllImagesLoaded(true);
        setIsLoading(false);
      } catch (error) {
        setAllImagesLoaded(false);
        setIsLoading(false);
      }
    };
    preloadImages();
  }, [industries]);
  return (
    <div>
    <section
        id="Indutries"
        className="py-32"
        style={{
          background:
            "linear-gradient(to bottom, hsl(0, 0%, 100%), hsl(20, 10%, 96%))",
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-12 bg-red-600"></div>
          </div>

          <SectionHeader
            badge="Industries"
            title="Built For Your Work"
            description="We understand the unique requirements of different construction
            specialties."
          />
        </div>

        <div className="container px-4 mx-auto relative z-10 max-w-7xl">
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
                              style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
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
                              boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
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
    </div>
  );
}

export default IndustriesSection;
