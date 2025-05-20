'use client';
import React from "react";
import { Target, BarChart3, Clock } from "lucide-react";
import { useTheme } from "@/components/contexts/theme-context";
import { useState } from "react";
import { useEffect, useRef } from "react";
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared";

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

  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div>
      <section
        id="steps"
        className="py-32"
        style={{
          background:
            "linear-gradient(to bottom, hsl(0, 0%, 100%), hsl(20, 10%, 96%))",
        }}
      >
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
