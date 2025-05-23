import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button, Input } from "@/components/shared";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { PopupModal } from "react-calendly";

// PricingPlan type
interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

// Pricing plans data
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

const PricingSection = () => {
  const { theme } = useTheme ? useTheme() : { theme: "light" };
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleCalendlyOpen = () => {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    setCalendlyOpen(true);
  };

  return (
    <div>
      <section
        id="Pricing"
        className="p-4 py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, hsl(0, 0%, 100%), hsl(20, 10%, 96%))",
        }}
      >
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
                    onClick={handleCalendlyOpen}
                  >
                    Get Started Now
                  </Button>

                  <div className="border-t border-gray-100 pt-6">
                    <p className="font-medium text-gray-700 mb-4">Includes:</p>
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
        </div>
        {/* FAQ teaser - visually distinct, responsive, and non-overlapping */}
        <div
          className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8 px-6 py-8 rounded-2xl shadow-xl bg-white/95 border border-gray-200 max-w-4xl mx-auto"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(31, 38, 135, 0.10), 0 1.5px 6px 0 rgba(220, 38, 38, 0.07)",
            backdropFilter: "blur(2px)",
            marginTop: "3rem", // Move it down below the pricing cards
            position: "relative",
          }}
        >
          <div className="max-w-md text-center md:text-left">
            <h3
              className={`text-2xl font-bold mb-2 ${
                theme === "dark" ? "text-gray-900" : "text-gray-900"
              }`}
            >
              Stay ahead of the curve
            </h3>
            <p className={theme === "dark" ? "text-gray-700" : "text-gray-600"}>
              Get the latest industry insights, tips, and exclusive content
              delivered straight to your inbox.
            </p>
          </div>

          <form
            className="w-full md:w-auto flex flex-col sm:flex-row gap-3 md:justify-end md:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleCalendlyOpen();
            }}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 min-w-[220px] placeholder-gray-400 transition"
              style={{
                borderColor: "hsl(0, 85%, 30%)",
                borderWidth: "2px",
                backgroundColor: theme === "dark" ? "#23272e" : "#fff",
                color: "#191919",
              }}
            />
            <Button
              style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
              className="hover:bg-red-700 text-white whitespace-nowrap shadow-md px-6 py-3 rounded-lg text-base font-semibold transition"
              type="submit"
              onClick={handleCalendlyOpen}
            >
              Get Started Now!
            </Button>
          </form>
        </div>

        {typeof window !== "undefined" && (
          <PopupModal
            url={`https://calendly.com/avorino/simple-projex-demo?email=${encodeURIComponent(
              email
            )}`}
            open={calendlyOpen}
            onModalClose={() => setCalendlyOpen(false)}
            rootElement={document.body}
          />
        )}
      </section>
    </div>
  );
};

export default PricingSection;
