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

export function PrivacyPolicyDialog({
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

  const privacyItems = [
    {
      title: "1. Information We Collect",
      content:
        "We collect the personal information you provide (e.g., name, email), usage data, and cookies to improve our service.",
    },
    {
      title: "2. How We Use Information",
      content:
        "Data is used to operate, maintain, and provide features of the service, communicate with you, and enhance user experience.",
    },
    {
      title: "3. Information Sharing",
      content:
        "We do not sell personal data. We may share data with service providers or as required by law.",
    },
    {
      title: "4. Cookies & Tracking",
      content:
        "We use cookies and similar technologies to collect analytics data and personalize content.",
    },
    {
      title: "5. Data Security",
      content:
        "We implement industry standard measures to protect your information.",
    },
    {
      title: "6. Your Rights",
      content: "You may access, correct, or delete your data by contacting us.",
    },
    {
      title: "7. Children's Privacy",
      content:
        "Our service is not intended for children under 13. We do not knowingly collect their data.",
    },
    {
      title: "8. Changes to This Policy",
      content:
        "We may update this policy; changes will be posted with a revised effective date.",
    },
    {
      title: "9. Contact Us",
      content: "For privacy inquiries, email build@simpleprojex.com.",
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
              Privacy Policy
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Last updated: April 2025
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {privacyItems.map((item, index) => (
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
              I acknowledge this Privacy Policy
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
