'use client';
import { useState } from "react";
import { Button } from "@/components/shared";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TermsOfServiceDialog } from "@/components/features/auth/legal/tos/tos-dialog";
import { PrivacyPolicyDialog } from "@/components/features/auth/legal/privacy-policy/pp-dialog";
import { CookiePolicyDialog } from "@/components/features/auth/legal/cookies/cookie-dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GoogleButton } from "@/components/features/auth/google-login/google-button";

export default function OnboardPage() {
  const router = useRouter();
  const [tosDialogOpen, setTosDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState("default");

  // Navigation functions
  const navigateToSignin = () => {
    router.push("/signin");
  };

  const navigateToSignup = () => {
    router.push("/signup");
  };

  // Animation variants
  const fadeInUpVariants = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  const leftToRightVariants = {
    initial: { x: -30, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  const rightToLeftVariants = {
    initial: { x: 30, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Function to open Legal Hub
  const openLegalHub = (type: "tos" | "privacy" | "cookie") => {
    // Close all dialogs first
    setTosDialogOpen(false);
    setPrivacyDialogOpen(false);
    setCookieDialogOpen(false);

    // Open the requested dialog
    if (type === "tos") {
      setTosDialogOpen(true);
    } else if (type === "privacy") {
      setPrivacyDialogOpen(true);
    } else if (type === "cookie") {
      setCookieDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-svh bg-white">
      {/* Legal Dialogs */}
      <TermsOfServiceDialog
        isOpen={tosDialogOpen}
        onOpenChange={setTosDialogOpen}
      />
      <PrivacyPolicyDialog
        isOpen={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
      />
      <CookiePolicyDialog
        isOpen={cookieDialogOpen}
        onOpenChange={setCookieDialogOpen}
      />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="container max-w-[1400px] px-6 md:px-12">
          <motion.div 
            className="flex flex-col lg:flex-row items-center lg:items-stretch gap-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Side - Branding Message */}
            <motion.div
              className="flex-1 flex flex-col justify-center"
              variants={leftToRightVariants}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center gap-4 mb-12">
                <Image
                  src="/icons/logo.svg"
                  alt="Simple ProjeX Logo"
                  width={72}
                  height={72}
                  className="object-contain size-20"
                />
                <h2 className="text-3xl font-medium">Simple ProjeX</h2>
              </div>
              
              <motion.h1
                variants={fadeInUpVariants}
                className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-wide"
              >
                Build Your Business, Not Spreadsheets
              </motion.h1>
              
              <motion.h2
                variants={fadeInUpVariants}
                className="text-xl md:text-2xl text-gray-700 mb-12"
              >
                Create, calculate, and deliver winning construction proposals
                in minutes with zero spreadsheet headaches.
              </motion.h2>
            </motion.div>

            {/* Right Side - Auth Options */}
            <motion.div 
              className="flex-1 flex flex-col justify-center max-w-md w-full"
              variants={rightToLeftVariants}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-10">
                Build now
              </h2>
              
              <h3 className="text-xl md:text-2xl font-bold mb-6">
                Join today.
              </h3>
              
              <div className="flex flex-col gap-4">
                <GoogleButton className="w-full py-5" />
                
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
                
                <Button
                  className="w-full py-5 bg-primary hover:bg-secondary hover:text-primary transition-all"
                  onClick={navigateToSignup}
                >
                  Create account
                </Button>
                
                <p className="text-xs text-gray-500 mt-1">
                  By signing up, you agree to our{" "}
                  <button
                    onClick={() => openLegalHub("tos")}
                    className="text-blue-500 hover:underline transition-colors"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    onClick={() => openLegalHub("privacy")}
                    className="text-blue-500 hover:underline transition-colors"
                  >
                    Privacy Policy
                  </button>
                  , including{" "}
                  <button
                    onClick={() => openLegalHub("cookie")}
                    className="text-blue-500 hover:underline transition-colors"
                  >
                    Cookie Use
                  </button>
                </p>
                
                <div className="mt-10">
                  <h4 className="font-bold text-base mb-4">
                    Already have an account?
                  </h4>
                  <Button
                    variant="outline"
                    className="w-full py-5 border-primary text-primary hover:bg-primary hover:text-secondary transition-all"
                    onClick={navigateToSignin}
                  >
                    Sign in
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="py-6 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
          <a
            href="#"
            className="hover:underline transition-colors duration-200"
          >
            Help Centre
          </a>
          <button
            onClick={() => openLegalHub("tos")}
            className="hover:underline transition-colors duration-200"
          >
            Terms of Service
          </button>
          <button
            onClick={() => openLegalHub("privacy")}
            className="hover:underline transition-colors duration-200"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => openLegalHub("cookie")}
            className="hover:underline transition-colors duration-200"
          >
            Cookie Policy
          </button>
          <a
            href="#"
            className="hover:underline transition-colors duration-200"
          >
            Settings
          </a>
          <span>© 2025 Simple ProjeX</span>
        </div>
      </motion.footer>
    </div>
  );
}