"use client";
import React from "react";
import { Target, BarChart3, Clock } from "lucide-react";
import { useTheme } from "@/components/contexts/theme-context";
import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Oswald } from "next/font/google";
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared";

const oswald = Oswald({ subsets: ["latin"] });

function StepsSection() {
  const { theme } = useTheme();
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const handleUserSelect = (idx: number) => {
    setActiveIndex(idx);
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => setIsPaused(false), 1000);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  const features = [
    {
      icon: <Target className="h-6 w-6 text-red-600" />,
      title: (
        <>
          <span className={theme === "dark" ? "text-white" : "text-black"}>
            1.{" "}
          </span>
          <span className="text-red-600">Build Your Smart Template</span>
        </>
      ),
      description:
        "Easily create reusable templates tailored to your projects. Leverage dynamic variables and real-time material pricing to calculate costs with precision.",
      demo: (
        <div
          className={`h-full w-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-[#23272e] border-[#333]"
              : "bg-white border-gray-200"
          } rounded-lg shadow-inner overflow-hidden`}
        >
          <div className="w-full h-full p-8 flex flex-col items-center justify-center">
            <div className="w-full mb-6 flex justify-center items-center">
              <img
                src="https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/template-builder.png"
                alt="Template Builder"
                className="max-w-full h-auto rounded-lg shadow"
                style={{ display: "block" }}
              />
            </div>
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
          <span className="text-red-600">Generate Proposals Instantly</span>
        </>
      ),
      description:
        "Use your templates or start from scratch to build proposals with live cost calculations based on selected materials and user inputs.",
      demo: (
        <div
          className={`h-full w-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-[#23272e] border-[#333]"
              : "bg-white border-gray-200"
          } rounded-lg shadow-inner overflow-hidden`}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full mb-6 flex justify-center items-center">
              <img
                src="https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/proposal-generator.png"
                alt="Proposal Generator"
                className="max-w-full h-auto rounded-lg shadow"
                style={{ display: "block" }}
              />
            </div>
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
          <span className="text-red-600">Share, Review & Sign</span>
        </>
      ),
      description:
        "Send proposals directly to clients for review, track their activity, and collect digital signatures — all in one place with no 3rd-party apps.",
      demo: (
        <div
          className={`h-full w-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-[#23272e] border-[#333]"
              : "bg-white border-gray-200"
          } rounded-lg shadow-inner overflow-hidden`}
        >
          <div className="w-full h-full p-1 flex flex-col items-center justify-center">
            <div className="w-full mb-6 flex justify-center items-center">
              <img
                src="https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/client-pov.png"
                alt="Client Review"
                className="max-w-full h-auto rounded-lg shadow"
                style={{ display: "block" }}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div>
      <section
        className="py-20 p-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, hsl(0, 0%, 100%), hsl(20, 10%, 96%))",
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-6">
          </div>

          <SectionHeader
            badge="How It Works"
            title="Transform Your Proposal Process"
            description="Simple ProjeX streamlines your proposal process, making it faster and more efficient. Here's how it works:"
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8">
            {/* Demo Content on the left (desktop only) */}
            <div
              className={`relative h-[400px] md:h-[570px] items-center justify-center rounded-2xl border overflow-hidden hidden lg:flex ${
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

            {/* Feature List on the right (mobile: demo appears in card) */}
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
                      ? "bg-[#23272e] border-[#333] hover:border-red-900"
                      : "border-gray-200 hover:border-red-100"
                  }`}
                  onClick={() => setActiveFeature(idx)}
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

                    {/* Show demo below description on mobile only for active feature */}
                    <div className="block lg:hidden mt-4">
                      {activeFeature === idx && hasMounted && (
                        <div className="w-full">{feature.demo}</div>
                      )}
                    </div>
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
    </div>
  );
}

export default StepsSection;
