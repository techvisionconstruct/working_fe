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

export function TermsOfServiceDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    onOpenChange(false);
  };

  const tosItems = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using Simple ProjeX at https://www.simpleprojex.com/, you agree to be bound by these Terms of Service.",
    },
    {
      title: "2. Description of Service",
      content:
        "Simple ProjeX connects contractors with opportunities and streamlines project management through templates, proposals, and contracts.",
    },
    {
      title: "3. User Responsibilities",
      content:
        "Users must provide accurate information, maintain the security of their account, and use the service lawfully.",
    },
    {
      title: "4. Templates, Proposals & Contracts",
      content:
        "Users can create templates, generate proposals, and finalize contracts. All content remains the user's responsibility.",
    },
    {
      title: "5. Intellectual Property",
      content:
        "All content and software on the site are the property of Simple ProjeX and its licensors.",
    },
    {
      title: "6. Disclaimer of Warranties",
      content:
        "The service is provided 'as is' without warranties of any kind.",
    },
    {
      title: "7. Limitation of Liability",
      content:
        "Simple ProjeX is not liable for indirect or consequential damages arising from the use of the service.",
    },
    {
      title: "8. Contact Information",
      content: "For questions, email us at build@simpleprojex.com.",
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
              Terms of Service
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Last updated: April 2025
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {tosItems.map((item, index) => (
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
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            />
            <span className="text-sm font-medium text-gray-700">
              I agree to the Terms of Service
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
              disabled={!accepted}
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
