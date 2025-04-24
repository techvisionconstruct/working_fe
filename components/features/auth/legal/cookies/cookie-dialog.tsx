import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/shared";
import { Button, ScrollArea } from "@/components/shared";
import { motion } from "framer-motion";

export function CookiePolicyDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAccept = () => {
    onOpenChange(false);
  };

  const cookieItems = [
    {
      title: "1. What Are Cookies",
      content:
        "Cookies are small text files stored on your device that help us improve your experience on Simple ProjeX by remembering your preferences and settings.",
    },
    {
      title: "2. Types of Cookies We Use",
      content:
        "We use essential cookies for site functionality, analytics cookies to understand usage patterns, and preference cookies to personalize your experience.",
    },
    {
      title: "3. How We Use Cookies",
      content:
        "Cookies help us operate and maintain our service, customize content, analyze site traffic, and enhance user experience across the platform.",
    },
    {
      title: "4. Third-Party Cookies",
      content:
        "Some cookies may be placed by our service providers to help us analyze site usage and provide certain features of Simple ProjeX.",
    },
    {
      title: "5. Cookie Management",
      content:
        "You can manage cookies through your browser settings. Blocking certain cookies may impact your experience on our site.",
    },
    {
      title: "6. Consent",
      content:
        "By using Simple ProjeX, you consent to our use of cookies as described in this policy and our Privacy Policy.",
    },
    {
      title: "7. Changes to Cookie Policy",
      content:
        "We may update this Cookie Policy periodically. All changes will be posted with a revised effective date.",
    },
    {
      title: "8. Contact Information",
      content:
        "For questions about our Cookie Policy, please email us at build@simpleprojex.com.",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className="text-2xl font-bold">
              Cookie Policy
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Last updated: April 2025
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {cookieItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="space-y-2"
              >
                <h3 className="font-semibold text-black">{item.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t pt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={acknowledged}
              onChange={() => setAcknowledged(!acknowledged)}
            />
            <span className="text-sm font-medium text-gray-700">
              I acknowledge this Cookie Policy
            </span>
          </label>

          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Close
              </Button>
            </DialogClose>
            <Button
              size="sm"
              disabled={!acknowledged}
              onClick={handleAccept}
              className="bg-black hover:bg-blue-900 transition-all duration-300"
            >
              Accept & Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
