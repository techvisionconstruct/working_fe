'use client';
import { useState } from "react";
import { LoginForm } from "@/components/features/auth/signin/signin-form";
import { Button } from "@/components/shared";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TermsOfServiceDialog } from "@/components/features/auth/legal/tos/tos-dialog";
import { PrivacyPolicyDialog } from "@/components/features/auth/legal/privacy-policy/pp-dialog";
import { CookiePolicyDialog } from "@/components/features/auth/legal/cookies/cookie-dialog";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();
  const [tosDialogOpen, setTosDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);

  // Navigation functions
  const navigateToSignup = () => {
    router.push("/signup");
  };

  const navigateToOnboard = () => {
    router.push("/onboard");
  };

  // Animation variants
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

  const fadeVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" },
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
    <div className="flex flex-col h-svh items-center justify-center bg-white">
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
      <motion.div
        className="flex w-full h-full max-w-[1400px] flex-col md:flex-row items-center justify-center gap-16 px-6 md:px-12"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Left side branding */}
        <motion.div
          key="left-content"
          className="flex-1 max-w-xl w-full mx-auto md:mx-0 text-center md:text-left"
          variants={leftToRightVariants}
          initial="initial"
          animate="animate"
        >
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/icons/logo.svg"
                alt="Projex Logo"
                width={56}
                height={56}
                className="object-contain size-16"
              />
              <h2 className="text-2xl font-medium">Simple ProjeX</h2>
            </div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Welcome back to Simple ProjeX
            </motion.h1>
            <motion.h2
              className="text-lg md:text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Access your account to manage your projects and proposals.
            </motion.h2>
            
            <Button 
              variant="outline" 
              className="text-sm mt-4"
              onClick={navigateToOnboard}
            >
              Back to overview
            </Button>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          key="right-content"
          className="flex-1 w-full max-w-md mx-auto md:mx-0"
          variants={rightToLeftVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="mx-auto bg-white rounded-xl border shadow-lg hover:shadow-xl transition-shadow duration-200 w-full"
            variants={fadeVariants}
          >
            <LoginForm
              className="w-full"
              onSwitchToRegister={navigateToSignup}
            />
            <div className="p-4 text-xs text-gray-500 border-t text-center">
              By signing in, you agree to our{" "}
              <button
                onClick={() => openLegalHub("tos")}
                className="text-blue-500 hover:underline transition-colors duration-200"
              >
                Terms
              </button>
              ,{" "}
              <button
                onClick={() => openLegalHub("privacy")}
                className="text-blue-500 hover:underline transition-colors duration-200"
              >
                Privacy
              </button>{" "}
              and{" "}
              <button
                onClick={() => openLegalHub("cookie")}
                className="text-blue-500 hover:underline transition-colors duration-200"
              >
                Cookie
              </button>{" "}
              policies.
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="py-6 w-full max-w-4xl"
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
