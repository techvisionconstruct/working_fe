
import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/shared";
import { CheckCircle } from "lucide-react";


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
    features: ["5 proposals per month", "Basic templates", "Cost estimation tools", "Email support"],
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
  return (
    <div>
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
    </div>
  );
}

export default PricingSection;
