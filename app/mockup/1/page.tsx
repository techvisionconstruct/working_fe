'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "@/components/contexts/theme-context";
import { FontCombobox } from "@/components/font-combobox";
import { Button, Card, CardContent, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Input } from "@/components/shared";
import { MoonIcon, SunIcon, ChevronRightIcon, ArrowRightIcon, CheckCircleIcon, Search, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { cn } from '@/lib/utils';

const sectionStyles = {
  baseGradient: (colors: any, theme: string) => ({
    background: theme === 'dark'
      ? `radial-gradient(ellipse at top, ${colors.cardDark}15, ${colors.background}),
         radial-gradient(ellipse at bottom, ${colors.background}, ${colors.background})`
      : `radial-gradient(ellipse at top, ${colors.card}15, ${colors.background}),
         radial-gradient(ellipse at bottom, ${colors.background}, ${colors.background})`
  }),
  heroGradient: (colors: any, theme: string) => ({
    background: theme === 'dark'
      ? `linear-gradient(180deg, 
          ${colors.background} 0%, 
          ${colors.background} 60%,
          ${colors.background} 100%)`
      : `linear-gradient(180deg, 
          ${colors.background} 0%, 
          ${colors.background} 60%,
          ${colors.background} 100%)`
  }),
  carouselGradient: (colors: any, theme: string) => ({
    background: theme === 'dark'
      ? `linear-gradient(180deg, 
          ${colors.background} 0%, 
          ${colors.cardDark}15 15%,
          ${colors.cardDark}25 50%,
          ${colors.cardDark}15 85%,
          ${colors.background} 100%)`
      : `linear-gradient(180deg, 
          ${colors.background} 0%, 
          ${colors.card}15 15%,
          ${colors.card}25 50%,
          ${colors.card}15 85%,
          ${colors.background} 100%)`
  }),
  timeSavingGradient: (colors: any, theme: string) => ({
    background: theme === 'dark'
      ? `linear-gradient(180deg, 
          ${colors.background} 0%, 
          ${colors.cardDark}15 15%,
          ${colors.background} 100%)`
      : `linear-gradient(180deg, 
          ${colors.background} 0%, 
          ${colors.card}15 15%,
          ${colors.background} 100%)`
  })
};

function HeroSection() {
  const { colors, theme, setTheme, setFonts, swatch, setSwatch } = useTheme();
  const [email, setEmail] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const textRef = useRef(null);

  return (
    <div className="relative pt-6 pb-32 overflow-hidden transition-colors duration-700" 
      style={sectionStyles.heroGradient(colors, theme)}>
      {/* Abstract shapes background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-[5%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-30"
          animate={{ 
            x: [0, 10, 0], 
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }} 
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{ 
            background: `radial-gradient(circle, ${colors.accent}, transparent 70%)`,
            filter: 'blur(60px)'
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] rounded-full opacity-30"
          animate={{ 
            x: [0, -15, 0], 
            y: [0, 10, 0],
            scale: [1, 1.03, 1],
          }} 
          transition={{ 
            duration: 10,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{ 
            background: `radial-gradient(circle, ${colors.accent}, transparent 70%)`,
            filter: 'blur(70px)'
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="w-full relative z-50 mb-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container relative mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={theme === "dark" ? colors.logoDark : colors.logoLight}
              alt="Logo"
              className="h-12 w-auto"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Select value={swatch} onValueChange={(value) => setSwatch(value)}>
                <SelectTrigger className="w-[180px] hover:ring-2 hover:ring-opacity-50 transition-all duration-300" 
                  style={{
                    backgroundColor: theme === 'dark' ? `${colors.cardDark}70` : `${colors.card}70`,
                    borderColor: `${colors.border}30`,
                    color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 4px 12px ${colors.accent}10`,
                    ["--ring-color" as any]: colors.accent
                  }}
                >
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent style={{
                  backgroundColor: theme === 'dark' ? `${colors.cardDark}90` : `${colors.card}90`,
                  borderColor: colors.border,
                  color: theme === 'dark' ? colors.readableCardDark : colors.readableCard,
                  backdropFilter: 'blur(20px)'
                }}>
                  <SelectItem value="palette1">Modern Dark</SelectItem>
                  <SelectItem value="palette2">Nature</SelectItem>
                  <SelectItem value="palette3">Bold</SelectItem>
                  <SelectItem value="default">Classic</SelectItem>
                  <SelectItem value="blue">Ocean</SelectItem>
                  <SelectItem value="sunsetCoral">Sunset Coral</SelectItem>
                  <SelectItem value="midnightBlue">Midnight Blue</SelectItem>
                  <SelectItem value="twitterDim">Twitter Dim</SelectItem>
                  <SelectItem value="sageGreen">Sage Green</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FontCombobox onFontChange={setFonts} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle dark mode"
                style={{ 
                  color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                  background: theme === 'dark' ? `${colors.cardDark}40` : `${colors.card}40`,
                  backdropFilter: 'blur(8px)',
                  boxShadow: `0 2px 10px ${colors.accent}15`
                }}
                className="hover:opacity-80 transition-opacity"
              >
                {theme === "dark" ? 
                  <SunIcon className="h-5 w-5 text-yellow-400" /> : 
                  <MoonIcon className="h-5 w-5 text-indigo-400" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 25%, ${colors.accent}15 0%, transparent 50%),
            radial-gradient(circle at 80% 75%, ${colors.accent}10 0%, transparent 50%)
          `,
          backdropFilter: 'blur(100px)',
        }}
      />
      
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{ 
                fontFamily: 'var(--font-heading)',
                color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                textShadow: theme === 'dark' ? '0 0 30px rgba(255,255,255,0.15)' : '0 0 30px rgba(0,0,0,0.15)',
                letterSpacing: '-0.03em'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="relative inline-block">
                Create
                <motion.span 
                  className="absolute left-0 bottom-1 h-[8px] rounded-full w-full" 
                  style={{ background: `${colors.accent}40` }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                />
              </span>{" "}
              proposals that
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ 
                  color: colors.accent,
                  WebkitTextStroke: `1px ${colors.accent}`,
                  textShadow: `0 0 20px ${colors.accent}50`
                }}
              >
                win clients.
              </motion.span>
            </motion.h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-12"
            style={{ 
              fontFamily: 'var(--font-body)',
              color: theme === 'dark' ? `${colors.readableCardDark}dd` : `${colors.readableForeground}dd`,
              lineHeight: 1.5
            }}
          >
            Create, calculate, and send construction proposals in minutes. 
            <span className="relative inline-block ml-1">
              No more spreadsheet headaches.
              <motion.span 
                className="absolute left-0 bottom-1 h-[3px] bg-accent rounded-full w-full"
                style={{ background: colors.accent }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.6, delay: 1.5 }}
              />
            </span>
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center w-full max-w-md mx-auto gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              className="w-full"
            >
              <Button
                className="w-full px-8 py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 text-base font-medium shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}ee)`,
                  color: getContrastColor(colors.accent),
                  boxShadow: isHovering 
                    ? `0 12px 24px -8px ${colors.accent}60` 
                    : `0 8px 16px -6px ${colors.accent}40`,
                }}
              >
                Schedule a Demo
                <motion.span
                  animate={{ x: isHovering ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </motion.span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full"
            >
              <Button
                className="w-full px-8 py-5 rounded-xl flex items-center justify-center transition-all duration-300 text-base font-medium"
                style={{
                  background: 'transparent',
                  color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                  boxShadow: `inset 0 0 0 2px ${colors.accent}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                Sign Up
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative"
        >
          <div 
            className="absolute inset-0 -z-10"
            style={{
              background: theme === 'dark' 
                ? `radial-gradient(circle at center, ${colors.accent}30, transparent 70%)`
                : `radial-gradient(circle at center, ${colors.accent}20, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <Card 
              className="overflow-hidden relative"
              style={{
                backgroundColor: theme === 'dark' ? `${colors.cardDark}60` : `${colors.card}60`,
                borderColor: `${colors.border}30`,
                boxShadow: `0 30px 60px -15px ${colors.accent}30`,
                backdropFilter: 'blur(16px)',
                maskImage: `linear-gradient(to bottom, 
                  rgba(0,0,0,1) 0%, 
                  rgba(0,0,0,1) 75%, 
                  rgba(0,0,0,0.3) 90%, 
                  rgba(0,0,0,0) 100%
                )`,
                WebkitMaskImage: `linear-gradient(to bottom, 
                  rgba(0,0,0,1) 0%, 
                  rgba(0,0,0,1) 75%, 
                  rgba(0,0,0,0.3) 90%, 
                  rgba(0,0,0,0) 100%
                )`
              }}
            >
              <CardContent className="p-0 relative">
                <div className="relative w-full h-full">
                  {/* Animated glow effect */}
                  <motion.div 
                    className="absolute inset-0 z-10 opacity-40 pointer-events-none"
                    animate={{
                      background: [
                        `radial-gradient(circle at 30% 30%, ${colors.accent}30, transparent 60%)`,
                        `radial-gradient(circle at 70% 70%, ${colors.accent}30, transparent 60%)`,
                        `radial-gradient(circle at 30% 30%, ${colors.accent}30, transparent 60%)`
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ filter: 'blur(40px)' }}
                  />
                  
                  <div 
                    className="relative w-full h-full rounded-xl overflow-hidden"
                  >
                    <Image
                      src="/hero.png"
                      alt="Hero Screenshot"
                      width={1080}
                      height={540}
                      className="rounded-xl object-cover w-full h-auto"
                      priority
                      quality={100}
                      sizes="100vw"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper function to get contrasting text color for buttons
function getContrastColor(hexColor: string): string {
  // Remove the hash if present
  hexColor = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  // Calculate luminance - giving more weight to green as human eyes are more sensitive to it
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark ones
  return luminance > 0.6 ? '#000000' : '#ffffff';
}

function Carousel() {
  const { colors, theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const containerWidth = useMotionValue(0);

  const carouselItems = [
    {
      id: 1,
      title: "Create a Template",
      description:
        "Start by creating customizable templates for different types of construction projects. Save time by reusing your best proposal structures.",
      icon: "📋"
    },
    {
      id: 2,
      title: "Create a Proposal",
      description:
        "Fill in project details, customize pricing, and adjust parameters. Our smart system helps you calculate costs accurately and efficiently.",
      icon: "⚡"
    },
    {
      id: 3,
      title: "Send Out the Proposal",
      description:
        "Review your professional proposal and send it directly to your clients. Track when they view it and get instant notifications on responses.",
      icon: "✉️"
    }
  ];

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        containerWidth.set(carouselRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [containerWidth]);

  // Calculate the width of each slide (80% of container width instead of 60%)
  const slideWidth = useTransform(containerWidth, (width) => width * 0.8);

  const handleDragEnd = (_: unknown, { offset }: { offset: { x: number } }) => {
    const swipeThreshold = 50;
    const swipe = offset.x < -swipeThreshold;
    if (swipe && activeIndex < carouselItems.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (offset.x > swipeThreshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
    animate(x, -activeIndex * (slideWidth.get() + 20), {
      type: "spring",
      stiffness: 400,
      damping: 40,
    });
  };

  useEffect(() => {
    animate(x, -activeIndex * (slideWidth.get() + 20), {
      type: "spring",
      stiffness: 400,
      damping: 40,
    });
  }, [activeIndex, slideWidth, x]);

  return (
    <section 
      className="min-h-[80vh] flex flex-col items-center justify-center py-32 relative overflow-hidden transition-colors duration-700" 
      style={sectionStyles.carouselGradient(colors, theme)}>
      {/* Background gradient effects */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            `radial-gradient(circle at 20% 30%, ${colors.accent}20 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, ${colors.accent}15 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 70%, ${colors.accent}20 0%, transparent 60%),
            radial-gradient(circle at 70% 20%, ${colors.accent}15 0%, transparent 60%)`,
            `radial-gradient(circle at 20% 30%, ${colors.accent}20 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, ${colors.accent}15 0%, transparent 60%)`
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: 'blur(120px)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16 px-4 relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-block relative mb-4"
        >
          <span 
            className="inline-block px-4 py-1 rounded-full text-sm"
            style={{ 
              background: `${colors.accent}20`,
              color: colors.accent,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.accent}30`
            }}
          >
            Simplified Process
          </span>
        </motion.div>
        
        <h2 
          className="text-4xl md:text-5xl font-bold mb-6 relative" 
          style={{ 
            color: colors.accent,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
            textShadow: `0 0 20px ${colors.accent}30`
          }}
        >
          <span className="relative">
            How It Works
            <motion.div 
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
              style={{ background: colors.accent }}
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </span>
        </h2>
        <p 
          className="text-lg md:text-xl max-w-2xl mx-auto"
          style={{ 
            color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
            fontFamily: 'var(--font-body)',
            opacity: 0.9,
            lineHeight: 1.6
          }}
        >
          Three simple steps to transform your proposal workflow and impress your clients
        </p>
      </motion.div>

      <div className="w-full overflow-hidden" ref={carouselRef}>
        <motion.div
          className="flex items-stretch pl-[8%]" // Changed from 10% to 8% for wider view
          drag="x"
          dragConstraints={{ left: -((carouselItems.length - 1) * (slideWidth.get() + 20)), right: 0 }}
          onDragEnd={handleDragEnd}
          style={{ x }}
        >
          {carouselItems.map((item) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 mr-6 rounded-3xl overflow-hidden backdrop-blur-md" // Changed mr-5 to mr-6
              style={{ 
                width: slideWidth, 
                background: theme === 'dark' ? `${colors.cardDark}90` : `${colors.card}90`,
                border: `1px solid ${colors.border}30`,
                boxShadow: `0 30px 60px -15px ${colors.accent}30`
              }}
              whileHover={{ 
                y: -5, 
                boxShadow: `0 40px 70px -15px ${colors.accent}40`,
                transition: { duration: 0.3 }
              }}
            >
              {/* Step indicator */}
              <div className="absolute top-6 right-6 z-10">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}90)`,
                    color: getContrastColor(colors.accent),
                    boxShadow: `0 4px 12px ${colors.accent}40`
                  }}
                >
                  {item.id}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-7 h-full">
                <div className="p-10 md:col-span-3 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <span 
                      className="inline-block text-5xl mb-6 rounded-2xl p-5"
                      style={{ 
                        background: theme === 'dark' 
                          ? `linear-gradient(135deg, ${colors.accent}25, ${colors.accent}15)`
                          : `linear-gradient(135deg, ${colors.accent}20, ${colors.accent}05)`,
                        boxShadow: `0 8px 20px ${colors.accent}15`,
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      {item.icon}
                    </span>
                    <h3 
                      className="text-3xl font-bold mb-6"
                      style={{ 
                        color: theme === 'dark' ? colors.readableCardDark : colors.readableCard,
                        fontFamily: 'var(--font-heading)',
                        textShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="text-lg"
                      style={{ 
                        color: theme === 'dark' ? colors.readableCardDark : colors.readableCard,
                        opacity: theme === 'dark' ? 0.9 : 0.8,
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1.6
                      }}
                    >
                      {item.description}
                    </p>
                    
                    <motion.div
                      className="mt-8"
                      whileHover={{ 
                        x: 5,
                        transition: { duration: 0.2 } 
                      }}
                    >
                      <Button
                        variant="link"
                        className="flex items-center gap-2 p-0 font-medium"
                        style={{ color: colors.accent }}
                      >
                        Learn more <ArrowRightIcon className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="flex items-center justify-center p-6 md:col-span-4 relative">
                  {/* Background glow for the image */}
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      background: `radial-gradient(circle at center, ${colors.accent}15, transparent 70%)`,
                      filter: 'blur(30px)'
                    }}
                  />
                  
                  <motion.div 
                    className="relative z-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -5, 
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Image
                      src={`/mockup/step${item.id}.png`}
                      width={400}
                      height={700}
                      alt={`Step ${item.id}: ${item.title}`}
                      className="w-full h-auto object-contain"
                      style={{
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="flex justify-center mt-12 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className="transition-all duration-300"
              style={{ 
                width: index === activeIndex ? '2.5rem' : '0.75rem',
                height: '0.75rem',
                borderRadius: '999px',
                background: index === activeIndex 
                  ? `linear-gradient(90deg, ${colors.accent}, ${colors.accent}80)`
                  : colors.border,
                opacity: index === activeIndex ? 1 : 0.5,
                boxShadow: index === activeIndex ? `0 2px 8px ${colors.accent}50` : 'none'
              }}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TimeSavingSection() {
  const { colors, theme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  
  const benefits = [
    { 
      icon: "⏱️", 
      title: "Save 60% of Time", 
      description: "Cut proposal creation time from days to hours" 
    },
    { 
      icon: "📊", 
      title: "Accurate Calculations", 
      description: "Eliminate errors with automated cost calculations" 
    },
    { 
      icon: "🔄", 
      title: "Easy Revisions", 
      description: "Update proposals in minutes, not hours" 
    }
  ];
  
  return (
    <section 
      className="w-full flex flex-col items-center justify-center py-32 px-4 relative overflow-hidden transition-colors duration-700" 
      style={sectionStyles.timeSavingGradient(colors, theme)}>
      {/* Dynamic background gradients */}
      <motion.div 
        className="absolute inset-0 opacity-50"
        animate={{ 
          background: [
            `radial-gradient(circle at 20% 20%, ${colors.accent}15 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, ${colors.accent}10 0%, transparent 40%)`,
            `radial-gradient(circle at 80% 20%, ${colors.accent}15 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, ${colors.accent}10 0%, transparent 40%)`,
            `radial-gradient(circle at 20% 20%, ${colors.accent}15 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, ${colors.accent}10 0%, transparent 40%)`
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: 'blur(100px)' }}
      />

      <motion.div
        className="relative z-10 mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="inline-block relative mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span 
            className="inline-block px-4 py-1 rounded-full text-sm"
            style={{ 
              background: `${colors.accent}20`,
              color: colors.accent,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.accent}30`
            }}
          >
            Productivity Boost
          </span>
        </motion.div>
        <h2 
          className="text-4xl md:text-5xl font-bold mt-4" 
          style={{ 
            color: colors.accent,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
            textShadow: `0 0 20px ${colors.accent}30`
          }}
        >
          <span className="relative">
            Save Time Instantly
            <motion.div 
              className="absolute -bottom-2 left-1/4 right-1/4 h-1 rounded-full"
              style={{ background: colors.accent }}
              initial={{ width: 0 }}
              whileInView={{ width: '50%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </span>
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl w-full"
      >
        <div 
          className="rounded-3xl p-10 md:p-16 backdrop-blur-lg relative overflow-hidden"
          style={{ 
            background: theme === 'dark' ? `${colors.cardDark}90` : `${colors.card}90`,
            boxShadow: `0 25px 50px -12px ${colors.accent}25`,
            border: `1px solid ${colors.border}30`
          }}
        >
          {/* Decorative element */}
          <div 
            className="absolute top-0 left-0 w-full h-1 z-10"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` 
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p 
              className="text-lg md:text-xl max-w-3xl mx-auto"
              style={{ 
                color: theme === 'dark' ? colors.readableCardDark : colors.readableCard,
                fontFamily: 'var(--font-body)',
                opacity: 0.9,
                lineHeight: 1.6
              }}
            >
              Creating proposals shouldn't slow you down. See how Simple ProjeX transforms your workflow and helps you focus on what matters—growing your business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div 
                className="rounded-2xl p-10 h-full relative overflow-hidden"
                style={{ 
                  background: theme === 'dark' ? `${colors.background}20` : `${colors.background}40`,
                  border: `1px solid ${colors.border}20`,
                  boxShadow: `0 15px 30px -10px ${colors.background}20`
                }}
              >
                {/* Visual comparison element */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: theme === 'dark' ? `${colors.background}40` : `${colors.background}30`,
                    color: theme === 'dark' ? colors.foreground : colors.foreground,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  BEFORE
                </div>
                
                <div className="flex flex-col items-center text-center relative">
                  <motion.span 
                    className="text-6xl md:text-7xl font-bold mb-4"
                    style={{ color: theme === 'dark' ? colors.foreground : colors.foreground }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    4h
                  </motion.span>
                  <span 
                    className="text-xl font-medium mb-2"
                    style={{ color: theme === 'dark' ? colors.readableCardDark : colors.readableCard }}
                  >
                    Manual Proposal
                  </span>
                  <p 
                    className="mt-4 text-base"
                    style={{ 
                      color: theme === 'dark' ? `${colors.readableCardDark}` : `${colors.readableCard}`,
                      opacity: 0.8,
                      lineHeight: 1.6
                    }}
                  >
                    Traditional method: gathering costs, formatting, calculations, and revisions
                  </p>
                  
                  {/* Visual elements */}
                  <div className="mt-8 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ background: `${colors.border}80` }}
                      />
                      <div className="text-sm text-left" style={{ color: theme === 'dark' ? `${colors.readableCardDark}` : `${colors.readableCard}` }}>
                        Manual calculations
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ background: `${colors.border}80` }}
                      />
                      <div className="text-sm text-left" style={{ color: theme === 'dark' ? `${colors.readableCardDark}` : `${colors.readableCard}` }}>
                        Complex spreadsheets
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ background: `${colors.border}80` }}
                      />
                      <div className="text-sm text-left" style={{ color: theme === 'dark' ? `${colors.readableCardDark}` : `${colors.readableCard}` }}>
                        Error-prone process
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="relative"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div 
                className="rounded-2xl p-10 h-full relative overflow-hidden"
                style={{ 
                  background: `${colors.accent}10`,
                  border: `2px solid ${colors.accent}40`,
                  boxShadow: `0 20px 40px ${colors.accent}15`
                }}
              >
                {/* Visual comparison element */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: `${colors.accent}30`,
                    color: colors.accent,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  AFTER
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <motion.span 
                    className="text-6xl md:text-7xl font-bold mb-4"
                    style={{ color: colors.accent }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    1.5h
                  </motion.span>
                  <span 
                    className="text-xl font-medium mb-2"
                    style={{ color: theme === 'dark' ? colors.readableCardDark : colors.readableCard }}
                  >
                    With Simple ProjeX
                  </span>
                  <p 
                    className="mt-4 text-base"
                    style={{ 
                      color: theme === 'dark' ? `${colors.readableCardDark}` : `${colors.readableCard}`,
                      opacity: 0.8,
                      lineHeight: 1.6
                    }}
                  >
                    Smart automation and templates cut your proposal time by more than half
                  </p>
                  
                  {/* Visual elements */}
                  <div className="mt-8 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-green-500">
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                      <div className="text-sm text-left" style={{ color: theme === 'dark' ? `${colors.readableCardDark}` : `${colors.readableCard}` }}>
                        Automated calculations
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-green-500">
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                      <div className="text-sm text-left" style={{ color: theme === 'dark' ? `${colors.readableCardDark}` : `${colors.readableCard}` }}>
                        Pre-built templates
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-green-500">
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                      <div className="text-sm text-left" style={{ color: theme === 'dark' ? `${colors.readableCardDark}` : `${colors.readableCard}` }}>
                        Real-time updates
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Benefits section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  boxShadow: `0 15px 30px -10px ${colors.accent}20`,
                  transition: { duration: 0.3 }
                }}
                className="rounded-xl p-6 text-center"
                style={{
                  background: theme === 'dark' ? `${colors.cardDark}50` : `${colors.card}50`,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${colors.border}20`
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-3">{benefit.icon}</span>
                  <h4 
                    className="text-lg font-semibold mb-2"
                    style={{ color: theme === 'dark' ? colors.readableCardDark : colors.readableCard }}
                  >
                    {benefit.title}
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ 
                      color: theme === 'dark' ? `${colors.readableCardDark}cc` : `${colors.readableCard}cc`,
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center mt-16 gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              className="w-full sm:w-auto"
            >
              <Button
                className="w-full px-8 py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 text-base font-medium shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}ee)`,
                  color: getContrastColor(colors.accent),
                  boxShadow: isHovering 
                    ? `0 12px 24px -8px ${colors.accent}60` 
                    : `0 8px 16px -6px ${colors.accent}40`,
                }}
              >
                Schedule a Demo
                <motion.span
                  animate={{ x: isHovering ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </motion.span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto"
            >
              <Button
                className="w-full px-8 py-5 rounded-xl flex items-center justify-center transition-all duration-300 text-base font-medium"
                style={{
                  background: 'transparent',
                  color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                  boxShadow: `inset 0 0 0 2px ${colors.accent}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                Sign Up
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function AppShowcaseSection() {
  const { colors, theme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Templates");
  const [activeView, setActiveView] = useState("grid"); // Add state for tracking active view
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Mock navigation items from your actual sidebar-data.ts
  const mockNavItems = [
    {
      section: "primary",
      items: [
        { 
          icon: FileIcon, 
          label: "Templates", 
          href: "#templates" 
        },
        { 
          icon: LayersIcon, 
          label: "Proposals", 
          href: "#proposals" 
        },
        { 
          icon: FileTextIcon, 
          label: "Contracts", 
          href: "#contracts" 
        },
      ]
    }
  ];

  // Mock template data for both grid and list views
  const mockTemplates = [
    {
      id: 1,
      name: "Template 1",
      description: "This is a customizable template for construction projects with modular sections and pricing components.",
      tags: ["Kitchen", "Bathroom"],
      created_at: "2025-12-04",
      status: "Active",
      image: "/template/template1.jpg"
    },
    {
      id: 2,
      name: "Template 2",
      description: "A comprehensive template designed for residential renovation projects with detailed scope of work sections.",
      tags: ["Renovation", "Residential"],
      created_at: "2025-11-22",
      status: "Active",
      image: "/template/template2.jpg"
    },
    {
      id: 3,
      name: "Template 3",
      description: "Commercial construction template with specialized sections for office buildings and retail spaces.",
      tags: ["Commercial", "Office"],
      created_at: "2025-10-15",
      status: "Active",
      image: "/template/template3.webp"
    }
  ];

  // Constants from sidebar.tsx
  const SIDEBAR_EXPANDED_WIDTH = "18rem";
  const SIDEBAR_COLLAPSED_WIDTH = "6.5rem"; 
  const ICON_LEFT_POSITION = "1.75rem"; 

  // Functions copied from sidebar.tsx for icon positioning
  const getIconPosition = () => {
    return isCollapsed ? "50%" : ICON_LEFT_POSITION;
  };

  const getIconTransform = () => {
    return isCollapsed ? "translateX(-50%) translateY(-50%)" : "translateY(-50%)";
  };

  // Sidebar animation variants (from sidebar.tsx)
  const sidebarVariants = {
    expanded: { 
      width: SIDEBAR_EXPANDED_WIDTH,
      borderRadius: "16px",
      transition: { 
        width: { duration: 0.18, ease: "easeInOut" }, 
        borderRadius: { duration: 0.12 }
      }
    },
    collapsed: { 
      width: SIDEBAR_COLLAPSED_WIDTH,
      borderRadius: "16px",
      transition: { 
        width: { duration: 0.18, ease: "easeInOut" }, 
        borderRadius: { duration: 0.12 }
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section 
      className="w-full pt-24 pb-32 px-4 md:px-8 relative overflow-hidden transition-colors duration-700"
      style={{
        background: theme === 'dark' 
          ? `linear-gradient(180deg, ${colors.background} 0%, ${colors.background}20 50%, ${colors.background} 100%)`
          : `linear-gradient(180deg, ${colors.background} 0%, ${colors.background}20 50%, ${colors.background} 100%)`,
      }}
    >
      {/* Background gradient effects */}
      <motion.div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 30% 20%, ${colors.accent}15 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, ${colors.accent}10 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 20%, ${colors.accent}15 0%, transparent 60%),
            radial-gradient(circle at 30% 60%, ${colors.accent}10 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 20%, ${colors.accent}15 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, ${colors.accent}10 0%, transparent 60%)`
          ]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: 'blur(100px)' }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block relative mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span 
              className="inline-block px-4 py-1 rounded-full text-sm"
              style={{ 
                background: `${colors.accent}20`,
                color: colors.accent,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colors.accent}30`
              }}
            >
              Complete Experience
            </span>
          </motion.div>
          
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 relative" 
            style={{ 
              color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em'
            }}
          >
            <span className="relative">
              Beautiful User Experience
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{ background: colors.accent }}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </span>
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ 
              color: theme === 'dark' ? `${colors.readableCardDark}dd` : `${colors.readableForeground}dd`,
              fontFamily: 'var(--font-body)',
              opacity: 0.9,
              lineHeight: 1.6
            }}
          >
            Intuitive navigation and beautiful design across the entire platform
            for a seamless user experience.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl"
          style={{
            background: theme === 'dark' ? `${colors.cardDark}60` : `${colors.card}60`,
            border: `1px solid ${colors.border}30`,
            boxShadow: `0 25px 50px -12px ${colors.accent}25`,
            height: '600px',
          }}
        >
          {/* Application Interface with Sidenav Layout */}
          <div className="w-full h-full flex overflow-hidden">
            {/* Sidebar - Based on real sidebar.tsx */}
            <div className="relative h-full" ref={navRef}>
              <motion.div 
                className="h-full py-6 border-r flex flex-col relative"
                style={{ 
                  background: theme === 'dark' ? `${colors.cardDark}90` : `${colors.card}90`,
                  borderColor: `${colors.border}30`,
                }}
                variants={sidebarVariants}
                initial="expanded"
                animate={isCollapsed ? "collapsed" : "expanded"}
              >
                {/* Logo section */}
                <div className="h-20 mb-12 relative">
                  <div 
                    className="absolute z-20 transition-all duration-400 ease-in-out"
                    style={{
                      left: getIconPosition(),
                      top: "50%",
                      transform: getIconTransform()
                    }}
                  >
                    {/* Logo circle */}
                    <Image 
                      src="/icons/logo.svg" 
                      alt="Projex Logo" 
                      width={58} 
                      height={58} 
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Fixed SIMPLE PROJEX layout */}
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div 
                        className="absolute top-1/2 -translate-y-1/2 overflow-visible"
                        style={{ 
                          left: `calc(${ICON_LEFT_POSITION} + 64px)`,
                          willChange: "transform, opacity",
                          transformOrigin: "left"
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { 
                            opacity: { duration: 0.13, delay: 0.04 },
                            x: { duration: 0.13, delay: 0.04 }
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          x: -10,
                          transition: { duration: 0.09, ease: "easeInOut" } 
                        }}
                      >
                        <div 
                          style={{ 
                            fontSize: "10pt",
                            letterSpacing: "0",
                            lineHeight: 0.9,
                            color: theme === 'dark' ? `${colors.readableCardDark}99` : `${colors.readableForeground}99`
                          }} 
                          className="uppercase tracking-wide mb-0.5"
                        >
                          SIMPLE
                        </div>
                        <div 
                          style={{ 
                            fontSize: "20pt", 
                            letterSpacing: "0.09rem",
                            lineHeight: "0.85",
                            color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                            fontWeight: 'bold'
                          }} 
                          className="uppercase"
                        >
                          PROJEX
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Navigation items */}
                <nav className="flex-1 flex flex-col px-2 overflow-y-auto">
                  {mockNavItems.map((section, index) => (
                    <motion.div 
                      key={section.section} 
                      className="mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: index * 0.06,
                          duration: 0.13
                        }
                      }}
                    >
                      {section.items.map((item) => (
                        <NavItemMock 
                          key={item.label}
                          icon={item.icon}
                          label={item.label}
                          isActive={activeNavItem === item.label}
                          isCollapsed={isCollapsed}
                          onClick={() => setActiveNavItem(item.label)}
                          iconPosition={getIconPosition()}
                          iconTransform={getIconTransform()}
                          colors={colors}
                          theme={theme}
                        />
                      ))}
                    </motion.div>
                  ))}
                </nav>

                {/* User profile section */}
                <div className="h-16 border-t pt-3 px-3" style={{ borderColor: `${colors.border}30` }}>
                  <div className="flex items-center w-full">
                    <div 
                      className={`transition-all duration-400 ease-in-out ${isCollapsed ? "mx-auto" : ""}`}
                    >
                      <div className="h-9 w-9 rounded-full ring-2 flex items-center justify-center" 
                        style={{ 
                          background: theme === 'dark' ? colors.background : colors.card,
                          color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                          borderColor: `${colors.accent}30`,
                        }}>
                        <span className="font-medium uppercase">JP</span>
                      </div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.div 
                          className="flex flex-col ml-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: { 
                              opacity: { duration: 0.13, delay: 0.04 },
                              x: { duration: 0.13, delay: 0.04 }
                            }
                          }}
                          exit={{ 
                            opacity: 0, 
                            x: -10,
                            transition: { duration: 0.09, ease: "easeInOut" } 
                          }}
                        >
                          <div className="font-medium text-sm" style={{ color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground }}>
                            John Projex
                          </div>
                          <div className="text-xs" style={{ color: theme === 'dark' ? `${colors.readableCardDark}80` : `${colors.readableForeground}80` }}>
                            john@example.com
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Dropdown indicator */}
                    {!isCollapsed && (
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </div>
                </div>

                {/* Toggle button - Properly positioned at the middle right edge */}
                <motion.button
                  className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-50"
                  style={{
                    background: theme === 'dark' ? colors.cardDark : colors.card,
                    border: `2px solid ${colors.border}30`,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                  }}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  animate={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  {isCollapsed ? 
                    <ChevronRight size={16} /> : 
                    <ChevronLeft size={16} />
                  }
                </motion.button>
              </motion.div>
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Mobile header for mobile view */}
              <div 
                className="md:hidden h-16 border-b flex items-center px-5 gap-3"
                style={{
                  background: theme === 'dark' ? `${colors.background}90` : `${colors.background}90`,
                  borderColor: `${colors.border}30`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <button
                  className="p-2 rounded-full"
                  style={{
                    background: theme === 'dark' ? `${colors.cardDark}50` : `${colors.card}50`,
                    color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                  }}
                  aria-label="Open sidebar"
                >
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="24" y2="12"/><line x1="4" y1="6" x2="24" y2="6"/><line x1="4" y1="18" x2="24" y2="18"/></svg>
                </button>
                <div 
                  className="rounded-full w-9 h-9 flex items-center justify-center"
                  style={{ 
                    background: theme === 'dark' 
                      ? `linear-gradient(135deg, ${colors.accent}80, ${colors.accent})` 
                      : `linear-gradient(135deg, ${colors.accent}60, ${colors.accent})`,
                    boxShadow: `0 2px 8px ${colors.accent}40`,
                    color: getContrastColor(colors.accent),
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}
                >
                  SP
                </div>
                <div className="flex flex-col justify-center ml-2">
                  <span 
                    className="text-xs leading-none font-semibold uppercase tracking-wide"
                    style={{ color: theme === 'dark' ? `${colors.readableCardDark}99` : `${colors.readableForeground}99` }}
                  >
                    SIMPLE
                  </span>
                  <span 
                    className="text-xl leading-tight uppercase font-bold tracking-wider"
                    style={{ 
                      color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                      letterSpacing: '0.09rem'
                    }}
                  >
                    PROJEX
                  </span>
                </div>
              </div>

              {/* Top header */}
              <div 
                className="h-16 border-b flex items-center justify-between px-6"
                style={{ 
                  background: theme === 'dark' ? `${colors.cardDark}50` : `${colors.card}50`,
                  borderColor: `${colors.border}30`,
                }}
              >
                <div className="flex items-center">
                  <h3 
                    className="text-xl font-semibold"
                    style={{ 
                      color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    {activeNavItem}
                  </h3>
                  <div 
                    className="ml-3 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      background: theme === 'dark' ? `${colors.accent}20` : `${colors.accent}15`,
                      color: colors.accent
                    }}
                  >
                    {activeNavItem === 'Templates' ? '3 items' : 
                     activeNavItem === 'Proposals' ? '7 items' : '2 items'}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    style={{ 
                      background: colors.accent,
                      color: getContrastColor(colors.accent),
                      boxShadow: `0 2px 6px ${colors.accent}40`
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    Create New
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ 
                      background: theme === 'dark' ? `${colors.background}60` : `${colors.background}60`,
                      color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ 
                      background: theme === 'dark' ? `${colors.background}60` : `${colors.background}60`,
                      color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Templates Content - Based on actual templates page */}
              <div 
                className="flex-1 p-6 overflow-auto"
                style={{ 
                  background: theme === 'dark' ? colors.background : colors.background,
                }}
              >
                {/* Controls */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Search Box */}
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4" style={{ color: theme === 'dark' ? `${colors.readableCardDark}80` : `${colors.readableForeground}80` }} />
                        <Input
                          type="search"
                          placeholder="Search templates..."
                          className="w-56 pl-9 rounded-lg text-sm"
                          style={{ 
                            background: theme === 'dark' ? `${colors.cardDark}50` : `${colors.card}50`,
                            borderColor: `${colors.border}50`,
                            color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                          }}
                        />
                      </div>
                      <Button
                        className="rounded-lg px-4 py-2 text-sm font-normal"
                        style={{ 
                          background: colors.accent,
                          color: getContrastColor(colors.accent)
                        }}
                      >
                        Search
                      </Button>
                    </div>

                    {/* Sort By */}
                    <div className="flex items-center space-x-2">
                      <p 
                        className="text-sm"
                        style={{ color: theme === 'dark' ? `${colors.readableCardDark}99` : `${colors.readableForeground}99` }}
                      >
                        Sort by
                      </p>
                      <div>
                        <Button 
                          variant="outline" 
                          className="justify-start text-sm px-3 py-1 h-9"
                          style={{ 
                            background: theme === 'dark' ? `${colors.cardDark}50` : `${colors.card}50`,
                            borderColor: `${colors.border}50`,
                            color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                          }}
                        >
                          Date (Newest First)
                          <ChevronRightIcon className="ml-2 h-4 w-4 rotate-90 opacity-50" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* View Tabs */}
                  <div 
                    className="flex rounded-lg p-1 h-10"
                    style={{ 
                      background: theme === 'dark' ? `${colors.cardDark}30` : `${colors.card}80`
                    }}
                  >
                    <Button
                      className={`rounded-md px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition-all duration-150 ${
                        activeView === 'grid' ? 'shadow-sm' : ''
                      }`}
                      style={{ 
                        background: activeView === 'grid' 
                          ? theme === 'dark' ? colors.cardDark : colors.background
                          : 'transparent',
                        color: activeView === 'grid'
                          ? theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                          : theme === 'dark' ? `${colors.readableCardDark}80` : `${colors.readableForeground}80`
                      }}
                      onClick={() => setActiveView('grid')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                      Grid
                    </Button>
                    <Button
                      className={`rounded-md px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition-all duration-150 ${
                        activeView === 'list' ? 'shadow-sm' : ''
                      }`}
                      style={{ 
                        background: activeView === 'list' 
                          ? theme === 'dark' ? colors.cardDark : colors.background
                          : 'transparent',
                        color: activeView === 'list'
                          ? theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                          : theme === 'dark' ? `${colors.readableCardDark}80` : `${colors.readableForeground}80`
                      }}
                      onClick={() => setActiveView('list')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" x2="21" y1="6" y2="6" />
                        <line x1="8" x2="21" y1="12" y2="12" />
                        <line x1="8" x2="21" y1="18" y2="18" />
                        <line x1="3" x2="3.01" y1="6" y2="6" />
                        <line x1="3" x2="3.01" y1="12" y2="12" />
                        <line x1="3" x2="3.01" y1="18" y2="18" />
                      </svg>
                      List
                    </Button>
                  </div>
                </div>

                {/* Conditional rendering based on active view */}
                {activeView === 'grid' ? (
                  /* Grid View */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockTemplates.map((item) => (
                      <motion.div
                        key={item.id}
                        className="rounded-xl overflow-hidden border"
                        style={{
                          background: theme === 'dark' ? `${colors.cardDark}50` : colors.card,
                          borderColor: `${colors.border}30`,
                        }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="h-32 relative">
                          <Image
                            src={item.image}
                            alt={`${item.name} preview`}
                            fill
                            className="object-cover"
                          />
                          <div 
                            className="absolute inset-0 opacity-30"
                            style={{ 
                              backgroundImage: `radial-gradient(circle at 30% 30%, ${colors.accent}40, transparent 70%)`,
                              mixBlendMode: 'overlay'
                            }}
                          />
                        </div>
                        
                        <div className="p-4">
                          <h4 
                            className="text-lg font-semibold mb-1"
                            style={{ 
                              color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                              fontFamily: 'var(--font-heading)'
                            }}
                          >
                            {item.name}
                          </h4>
                          
                          <p 
                            className="text-sm mb-3 line-clamp-2 min-h-[40px]"
                            style={{ 
                              color: theme === 'dark' ? `${colors.readableCardDark}90` : `${colors.readableForeground}90`,
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {item.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.tags.map((tag, i) => (
                              <span 
                                key={i}
                                className="text-xs font-medium px-2 py-1 rounded"
                                style={{
                                  background: theme === 'dark' ? `${colors.background}50` : `${colors.background}70`,
                                  color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div 
                            className="text-xs mt-3 pt-3 border-t flex justify-between items-center"
                            style={{ 
                              borderColor: `${colors.border}30`,
                              color: theme === 'dark' ? `${colors.readableCardDark}70` : `${colors.readableForeground}70`,
                            }}
                          >
                            <span>Created {formatDate(item.created_at)}</span>
                            <span 
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ 
                                background: theme === 'dark' ? `${colors.accent}20` : `${colors.accent}15`,
                                color: colors.accent
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* List View - Based on template-list-view.tsx */
                  <div className="space-y-3">
                    {mockTemplates.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          duration: 0.3,
                        }}
                        className="rounded-xl border overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        style={{ 
                          background: theme === 'dark' ? `${colors.cardDark}80` : `${colors.card}80`,
                          borderColor: `${colors.border}30`,
                        }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative h-32 w-full md:w-48 md:h-auto shrink-0">
                            <Image
                              src={item.image}
                              alt={`${item.name} preview`}
                              fill
                              className="object-cover"
                            />
                            <div 
                              className="absolute inset-0 opacity-30"
                              style={{ 
                                backgroundImage: `radial-gradient(circle at 30% 30%, ${colors.accent}40, transparent 70%)`,
                                mixBlendMode: 'overlay'
                              }}
                            />
                          </div>
                          
                          <div className="p-5 w-full">
                            <div className="flex justify-between items-start">
                              <h3 
                                className="text-lg font-semibold mb-1"
                                style={{ 
                                  color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                                  fontFamily: 'var(--font-heading)'
                                }}
                              >
                                {item.name}
                              </h3>
                              <span 
                                className="text-xs font-medium mt-1"
                                style={{ 
                                  color: theme === 'dark' ? `${colors.readableCardDark}70` : `${colors.readableForeground}70`,
                                }}
                              >
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                            
                            <p 
                              className="mb-3 text-sm line-clamp-2"
                              style={{ 
                                color: theme === 'dark' ? `${colors.readableCardDark}90` : `${colors.readableForeground}90`,
                                fontFamily: 'var(--font-body)',
                              }}
                            >
                              {item.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.tags.map((tag, i) => (
                                <span 
                                  key={i}
                                  className="text-xs font-medium px-2 py-1 rounded"
                                  style={{
                                    background: theme === 'dark' ? `${colors.background}50` : `${colors.background}70`,
                                    color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <span
                                  className="flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium"
                                  style={{ 
                                    borderColor: `${colors.border}30`,
                                    background: theme === 'dark' ? `${colors.background}50` : `${colors.background}70`,
                                    color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                                  }}
                                >
                                  <span className="uppercase font-semibold">Parameters</span>
                                  <span className="ml-1 h-4 w-4 rounded flex items-center justify-center"
                                    style={{ 
                                      background: theme === 'dark' ? `${colors.cardDark}70` : `${colors.card}70`,
                                    }}
                                  >
                                    3
                                  </span>
                                </span>
                                <span
                                  className="flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium"
                                  style={{ 
                                    borderColor: `${colors.border}30`,
                                    background: theme === 'dark' ? `${colors.background}50` : `${colors.background}70`,
                                    color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                                  }}
                                >
                                  <span className="uppercase font-semibold">Modules</span>
                                  <span className="ml-1 h-4 w-4 rounded flex items-center justify-center"
                                    style={{ 
                                      background: theme === 'dark' ? `${colors.cardDark}70` : `${colors.card}70`,
                                    }}
                                  >
                                    5
                                  </span>
                                </span>
                              </div>
                              <ChevronRight 
                                className="h-5 w-5" 
                                style={{ 
                                  color: theme === 'dark' ? `${colors.readableCardDark}60` : `${colors.readableForeground}60`
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-center mt-16 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            className="w-full sm:w-auto"
          >
            <Button
              className="w-full px-8 py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 text-base font-medium shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}ee)`,
                color: getContrastColor(colors.accent),
                boxShadow: isHovering 
                  ? `0 12px 24px -8px ${colors.accent}60` 
                  : `0 8px 16px -6px ${colors.accent}40`,
              }}
            >
              Start Free Trial
              <motion.span
                animate={{ x: isHovering ? 5 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </motion.span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto"
          >
            <Button
              className="w-full px-8 py-5 rounded-xl flex items-center justify-center transition-all duration-300 text-base font-medium"
              style={{
                background: 'transparent',
                color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
                boxShadow: `inset 0 0 0 2px ${colors.accent}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              Learn About Features
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Navigation item component (simplified version of the real NavItem component)
function NavItemMock({ 
  icon: Icon, 
  label, 
  isActive, 
  isCollapsed,
  onClick,
  iconPosition,
  iconTransform,
  colors,
  theme
}: { 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean; 
  isCollapsed: boolean;
  onClick: () => void;
  iconPosition: string;
  iconTransform: string;
  colors: any;
  theme: string;
}) {
  // Local hover state
  const [isLocalHover, setIsLocalHover] = useState(false);
  
  return (
    <div onClick={onClick} className="block relative h-12">
      <motion.div
        className={cn(
          "relative w-full h-full",
          !isCollapsed && "rounded-[30px]",
          "transition-all duration-300 ease-in-out",
          !isCollapsed && isActive ? "font-bold bg-sidebar-accent" : ""
        )}
        onMouseEnter={() => setIsLocalHover(true)}
        onMouseLeave={() => setIsLocalHover(false)}
        whileHover={!isCollapsed ? 
          { 
            backgroundColor: theme === 'dark' ? `${colors.cardDark}` : `${colors.card}`,
            transition: { duration: 0.09, ease: "easeInOut" }
          } : {}}
        animate={{
          backgroundColor: !isCollapsed && isActive 
            ? theme === 'dark' ? `${colors.cardDark}` : `${colors.card}` 
            : "transparent",
        }}
        transition={{
          duration: 0.09,
          backgroundColor: { duration: 0.09 }
        }}
        style={{
          cursor: 'pointer'
        }}
      >
        {/* Icon container with dynamic positioning based on sidebar state */}
        <div 
          className="absolute top-1/2 z-10 transition-all duration-400 ease-in-out"
          style={{ 
            left: iconPosition,
            transform: iconTransform
          }}
        >
          {/* Circle background directly around the icon in collapsed state */}
          {isCollapsed && (isActive || isLocalHover) && (
            <div 
              className="absolute inset-0 z-0 rounded-full"
              style={{
                width: "38px",
                height: "38px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: theme === 'dark' ? `${colors.cardDark}` : `${colors.card}`,
              }}
            />
          )}
          
          {/* Icon element with animations */}
          <motion.div
            className="relative z-10"
            initial={false}
            animate={{ 
              scale: isActive || isLocalHover ? 1.1 : 1,
              rotate: isLocalHover ? 5 : 0,
              opacity: 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 600, 
              damping: 22,
              opacity: { duration: 0 }
            }}
          >
            <Icon 
              size={22} 
              style={{ 
                color: isActive 
                  ? colors.accent
                  : theme === 'dark' ? `${colors.readableCardDark}80` : `${colors.readableForeground}80`
              }} 
            />
          </motion.div>
          
          {/* Active indicator dot */}
          {isActive && (
            <motion.div 
              className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full"
              style={{ background: colors.accent }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 600, 
                damping: 22 
              }}
            />
          )}
        </div>
        
        {/* Label absolutely positioned for clean animation */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2"
              style={{ 
                left: "calc(" + iconPosition + " + 40px)",
                fontSize: "16px",
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: { 
                  opacity: { duration: 0.13, delay: 0.04 },
                  x: { duration: 0.13, delay: 0.04 },
                  ease: "easeInOut"
                }
              }}
              exit={{ 
                opacity: 0, 
                x: -10,
                transition: { duration: 0.09, ease: "easeInOut" } 
              }}
            >
              <span style={{
                color: isActive 
                  ? theme === 'dark' ? colors.readableCardDark : colors.readableForeground
                  : theme === 'dark' ? `${colors.readableCardDark}80` : `${colors.readableForeground}80`,
                fontWeight: isActive ? 600 : 400
              }}>
                {label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Import necessary icons for the sidenav
function FileIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function FileTextIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function LayersIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2.5 12.5" />
      <path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2.5 17.5" />
    </svg>
  );
}

function Footer() {
  const { colors, theme } = useTheme();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { label: "About", href: "#" },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" }
  ];

  return (
    <footer
      style={{
        ...sectionStyles.baseGradient(colors, theme),
        borderTop: `1px solid ${colors.border}20`,
        color: theme === 'dark' ? colors.readableCardDark : colors.readableForeground,
      }}
      className="py-16 mt-auto transition-colors duration-700"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col items-center justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            src={theme === "dark" ? colors.logoDark : colors.logoLight}
            alt="Simple ProjeX Logo"
            className="h-10 w-auto"
          />
          
          <div className="flex flex-wrap justify-center gap-5 md:gap-8">
            {footerLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Button 
                  variant="link" 
                  style={{ color: theme === 'dark' ? colors.readableCardDark : colors.foreground }}
                  className="transition-all hover:text-accent duration-300"
                >
                  {link.label}
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="flex gap-6 mt-2">
            {["twitter", "facebook", "instagram", "linkedin"].map((social, index) => (
              <motion.button
                key={social}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  background: theme === 'dark' ? `${colors.cardDark}60` : `${colors.card}60`,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${colors.border}30`
                }}
              >
                <span className="text-lg" style={{ color: theme === 'dark' ? colors.readableCardDark : colors.foreground }}>
                  {social === "twitter" ? "𝕏" : 
                   social === "facebook" ? "f" : 
                   social === "instagram" ? "📷" : "in"}
                </span>
              </motion.button>
            ))}
          </div>
          
          <motion.div 
            className="text-sm opacity-70 mt-4 text-center"
            style={{ 
              fontFamily: 'var(--font-body)',
              color: theme === 'dark' ? colors.readableCardDark : colors.foreground, 
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            © {currentYear} Simple ProjeX. All rights reserved. <br className="block md:hidden" />
            <span className="hidden md:inline">•</span> Designed for construction professionals worldwide
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <StylesInjector />
      <main 
        className="flex flex-col min-h-screen overflow-hidden" 
        style={{ 
          background: 'var(--background)',
          color: 'var(--foreground)',
          scrollBehavior: 'smooth'
        }}
      >
        <HeroSection />
        <Carousel />
        <TimeSavingSection />
        <AppShowcaseSection />
        <Footer />
      </main>
    </ThemeProvider>
  );
}

// This component injects necessary styles for our font variables
function StylesInjector() {
  return (
    <style jsx global>{`
      :root {
        --font-heading: system-ui, sans-serif;
        --font-body: system-ui, sans-serif;
      }
      
      /* Apply heading font to all heading elements */
      h1, h2, h3, h4, h5, h6, .heading-text {
        font-family: var(--font-heading);
        letter-spacing: -0.02em;
      }
      
      /* Apply body font to all other text elements */
      body, p, span, div, button, a, input, select, textarea, 
      label, li, td, th, blockquote, figcaption, .body-text {
        font-family: var(--font-body);
      }

      /* Specific heading styles */
      h1 {
        letter-spacing: -0.03em;
      }
      
      h2 {
        letter-spacing: -0.02em;
      }

      /* Maintain font consistency in form elements */
      button, input, select, textarea {
        font-family: var(--font-body);
      }
      
      /* Custom button text uses body font by default */
      .btn-text, .button-text {
        font-family: var(--font-body);
        font-weight: 600;
      }
      
      /* Special case for accent text that should use heading font */
      .accent-text, .brand-text, .logo-text {
        font-family: var(--font-heading);
      }

      /* Smooth scrolling and animations */
      html {
        scroll-behavior: smooth;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }
      
      /* Enhanced focus styles */
      *:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    `}</style>
  );
}