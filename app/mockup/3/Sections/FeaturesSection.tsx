import React from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const oswald = Oswald({ subsets: ["latin"] });

function FeaturesSection() {

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
  return (
    <div>
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
    </div>
  );
}

export default FeaturesSection;
