"use client";

import { useState } from "react";
import { LoginForm } from "@/components/features/auth/login/login-form";
import { RegisterForm } from "@/components/features/auth/register/register-form";
import { Button } from "@/components/shared";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TermsOfServiceDialog } from "@/components/features/legal/tos/tos-dialog";
import { PrivacyPolicyDialog } from "@/components/features/legal/privacy-policy/pp-dialog";
import { CookiePolicyDialog } from "@/components/features/legal/cookies/cookie-dialog";
import { Cookie, HeartHandshake, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [currentView, setCurrentView] = useState("default");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tosDialogOpen, setTosDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false); // New state for Cookie Policy dialog

  const switchToRegisterView = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView("register");
      setTimeout(() => setIsTransitioning(false), 100);
    }, 400);
  };

  const switchToLoginView = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView("login");
      setTimeout(() => setIsTransitioning(false), 100);
    }, 400);
  };

  const switchToDefaultView = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView("default");
      setTimeout(() => setIsTransitioning(false), 100);
    }, 400);
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const leftToRightVariants = {
    initial: { x: -50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
    exit: {
      x: 50,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  const rightToLeftVariants = {
    initial: { x: 50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Function to open Legal Hub
  const openLegalHub = (type) => {
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
    <div className="flex flex-col min-h-svh items-center justify-center bg-white p-4 md:p-0 overflow-hidden">
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

      <motion.div
        className="flex w-full max-w-5xl flex-col md:flex-row md:mt-20 items-center justify-between gap-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Left side that switches with right side */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`left-${currentView}`}
            className={cn(
              "flex-1 transition-all",
              currentView === "register"
                ? "order-2 md:order-2"
                : "order-1 md:order-1 text-center md:text-left"
            )}
            variants={
              currentView === "register"
                ? rightToLeftVariants
                : leftToRightVariants
            }
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {currentView === "register" ? (
              <div>
                <Image
                  src="/icons/logo.svg"
                  alt="Projex Logo"
                  width={56}
                  height={56}
                  className="object-contain mx-auto md:mx-0 size-28"
                />
                <motion.h1
                  className="text-5xl font-bold text-black mb-4 tracking-wider"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Simplify Your Projects, Amplify Your Success!
                </motion.h1>
                <motion.h2
                  className="text-lg text-gray-700 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Creating proposals shouldn't slow you down. See how Simple
                  ProjeX transforms your workflow and helps you focus on what
                  matters—growing your business.
                </motion.h2>
              </div>
            ) : (
              <div>
                <Image
                  src="/icons/logo.svg"
                  alt="Projex Logo"
                  width={56}
                  height={56}
                  className="object-contain mx-auto md:mx-0 size-28"
                />
                <motion.h1
                  className="text-5xl font-bold text-black mb-4 tracking-wider"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Build Your Business, Not Spreadsheets!
                </motion.h1>
                <motion.h2
                  className="text-lg text-gray-700 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Create, calculate, and deliver winning construction proposals
                  in minutes with zero spreadsheet headaches.
                </motion.h2>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right side - Dynamic content based on currentView */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`right-${currentView}`}
            className={cn(
              "flex-1 w-full",
              currentView === "register"
                ? "order-1 md:order-1"
                : "order-2 md:order-2"
            )}
            variants={
              currentView === "register"
                ? leftToRightVariants
                : rightToLeftVariants
            }
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {currentView === "default" && (
              <motion.div
                className="flex flex-col gap-4 max-w-lg mx-auto"
                variants={fadeVariants}
              >
                <Button
                  variant="outline"
                  className="w-full border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign up with Google
                </Button>

                <div className="relative text-center my-2">
                  <hr className="border-gray-300" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500 text-sm">
                    OR
                  </span>
                </div>

                <Button
                  className="w-full bg-black hover:bg-blue-900 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  onClick={switchToRegisterView}
                >
                  Create account
                </Button>

                <p className="text-xs text-gray-500 mt-2">
                  By signing up, you agree to the{" "}
                  <button
                    onClick={() => openLegalHub("tos")}
                    className="text-blue-500 hover:underline transition-colors duration-200"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    onClick={() => openLegalHub("privacy")}
                    className="text-blue-500 hover:underline transition-colors duration-200"
                  >
                    Privacy Policy
                  </button>
                  , including{" "}
                  <button
                    onClick={() => openLegalHub("cookie")}
                    className="text-blue-500 hover:underline transition-colors duration-200"
                  >
                    Cookie Use
                  </button>
                  .
                </p>

                <div>
                  <p className="font-bold text-gray-800 mb-4">
                    Already have an account?
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-black text-black hover:bg-blue-50 transition-all duration-300 hover:shadow-md"
                    onClick={switchToLoginView}
                  >
                    Sign in
                  </Button>
                </div>
              </motion.div>
            )}

            {currentView === "login" && (
              <motion.div
                className="mx-auto bg-white rounded-xl border text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={fadeVariants}
              >
                <div className="mt-2 pr-2 flex justify-between">
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={switchToDefaultView}
                  >
                    ← Back to options
                  </Button>
                </div>
                <LoginForm
                  className="w-full"
                  onSwitchToRegister={switchToRegisterView}
                />
                <div className="p-4 text-xs text-gray-500 border-t">
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
            )}

            {currentView === "register" && (
              <motion.div
                className="mx-auto bg-white rounded-xl border text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={fadeVariants}
              >
                <div className="mt-2 pr-2 flex justify-end">
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={switchToDefaultView}
                  >
                    Back to options →
                  </Button>
                </div>
                <RegisterForm
                  className="w-full"
                  onSwitchToLogin={switchToLoginView}
                />
                <div className="p-4 text-xs text-gray-500 border-t">
                  By signing up, you agree to our{" "}
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
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-auto pt-10 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
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
