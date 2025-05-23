"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
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
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 14-day free trial so you can explore all features before committing.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your data is encrypted and securely stored on our servers. We use industry-standard security practices to keep your information safe.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Yes, Simple ProjeX allows real-time collaboration with your team and clients, including comments and file sharing.",
  },
  {
    question: "Does Simple ProjeX support digital signatures?",
    answer:
      "Yes, you can collect legally binding digital signatures directly within your proposals.",
  },
  {
    question: "What support options are available?",
    answer:
      "We offer email and live chat support, as well as a comprehensive help center.",
  },
  {
    question: "Can I export my proposals as PDF?",
    answer:
      "Yes, you can export any proposal as a professionally formatted PDF.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply sign up, choose a template, and start creating your first proposal in minutes!",
  },
];

export default function AllFAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #fff 60%, #ffeaea 100%)",
        color: "#1a1a1a",
      }}
    >
      {/* Decorative Red Bubble */}
      <div className="absolute top-[-6rem] left-[-8rem] w-[28rem] h-[28rem] rounded-full bg-red-700/10 blur-3xl z-0"></div>
      <div className="absolute bottom-[-8rem] right-[-6rem] w-[24rem] h-[24rem] rounded-full bg-red-700/10 blur-3xl z-0"></div>

      <div className="container mx-auto px-6 py-16 relative z-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-7 h-7 text-red-600" />
          <span className="uppercase tracking-wider text-red-700 font-semibold text-sm">
            FAQ
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          All <span className="text-red-600">Frequently Asked Questions</span>
        </h1>
        <p className="mb-10 text-lg text-gray-700">
          Everything you need to know about Simple ProjeX. Can’t find your
          answer?{" "}
          <a
            href="mailto:build@simpleprojex.com"
            className="text-red-600 underline hover:text-red-800"
          >
            Contact support.
          </a>
          .
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border border-gray-300 bg-white shadow transition-all duration-300 ${
                openIndex === idx ? "border-red-700 shadow-lg" : ""
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`faq-content-${idx}`}
              >
                <span
                  className={`font-semibold text-lg transition-colors ${
                    openIndex === idx ? "text-red-700" : "text-black"
                  }`}
                >
                  {faq.question}
                </span>
                <span className="ml-4">
                  {openIndex === idx ? (
                    <ChevronUp className="w-6 h-6 text-red-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-500 group-hover:text-red-600 transition-colors" />
                  )}
                </span>
              </button>
              {openIndex === idx && (
                <div
                  id={`faq-content-${idx}`}
                  className="px-6 pb-5 text-gray-700 animate-fadeIn"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
}
