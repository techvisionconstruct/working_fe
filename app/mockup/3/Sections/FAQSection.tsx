
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Oswald } from 'next/font/google';
import { Badge, Button } from '@/components/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import { HelpCircle, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';


// FAQ questions data
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

const FAQSection = () => {
  const { theme } = useTheme ? useTheme() : { theme: 'light' };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

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
  }, [isPaused, hasMounted]);

  const handleUserSelect = (idx: number) => {
    setActiveIndex(idx);
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => setIsPaused(false), 1000);
  };

  return (
    <div>
              <section
      id="faq"
      className={`p-4 py-24 relative overflow-hidden ${
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
    </div>
  )
}

export default FAQSection
