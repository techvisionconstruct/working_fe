"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shared";
import { X } from "lucide-react";

declare global {
  interface Window {
    contractTourEndCallback?: () => void;
    contractTourCreateCallback?: () => void;
  }
}

type ContractTourProps = {
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
};

export function ContractTour({ isRunning, setIsRunning }: ContractTourProps) {
  const router = useRouter();

  // Helper to end the tour
  const endTour = () => {
    localStorage.setItem("hasSeenContractsTour", "true");
    setIsRunning(false);
  };

  // Helper to redirect to create contract
  const redirectToCreateContract = () => {
    localStorage.setItem("hasSeenContractsTour", "true");
    setIsRunning(false);
    router.push("/proposals");
  };

  useEffect(() => {
    if (isRunning) {
      // Inject custom Apple-like popover styles
      const styleId = 'apple-popover-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .apple-popover.driver-popover {
            background: #fff !important;
            border-radius: 18px !important;
            box-shadow: 0 8px 32px 0 rgba(60,60,60,0.10), 0 1.5px 4px 0 rgba(60,60,60,0.08);
            border: 1px solid #ececec !important;
            padding: 1.5rem 1.5rem 1rem 1.5rem !important;
            color: #222 !important;
            font-family: 'Inter', 'San Francisco', 'Segoe UI', Arial, sans-serif;
            min-width: 320px;
            max-width: 380px;
          }
          .apple-popover .driver-popover-title {
            font-size: 1.18rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #111;
            letter-spacing: -0.01em;
          }
          .apple-popover .driver-popover-description {
            font-size: 1rem;
            color: #444;
            margin-bottom: 0.5rem;
          }
          .apple-popover .driver-popover-arrow {
            color: #fff;
            filter: drop-shadow(0 2px 8px rgba(60,60,60,0.10));
          }
          .apple-popover .driver-popover-close-btn {
            top: 18px !important;
            right: 18px !important;
            background: transparent !important;
            color: #aaa !important;
            border-radius: 50%;
            transition: background 0.15s;
            pointer-events: auto !important;
            cursor: pointer !important;
            z-index: 1000010 !important;
          }
          .apple-popover .driver-popover-close-btn:hover {
            background: #f2f2f2 !important;
            color: #222 !important;
          }
          .apple-popover .driver-popover-footer {
            border-top: none !important;
            margin-top: 1.2rem;
            padding: 0;
            background: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            pointer-events: auto !important;
            z-index: 1000002 !important;
          }
          .apple-popover .driver-popover-progress-text {
            color: #bbb;
            font-size: 0.95rem;
            font-weight: 500;
          }
          .apple-popover .driver-popover-prev-btn,
          .apple-popover .driver-popover-next-btn {
            border-radius: 8px !important;
            border: none !important;
            background: #f5f5f7 !important;
            color: #222 !important;
            font-weight: 500;
            font-size: 1rem;
            padding: 0.45rem 1.1rem !important;
            margin: 0 0.2rem;
            box-shadow: none !important;
            transition: background 0.15s;
            pointer-events: auto !important;
            cursor: pointer !important;
            position: relative;
            z-index: 1000010 !important;
          }
          .apple-popover .driver-popover-next-btn {
            background: #222 !important;
            color: #fff !important;
          }
          .apple-popover .driver-popover-prev-btn:hover {
            background: #e5e5ea !important;
            color: #111 !important;
          }
          .apple-popover .driver-popover-next-btn:hover {
            background: #0f0f0f !important;
            color: #fff !important;
          }
          .apple-popover .driver-popover-end-btn {
            border-radius: 8px !important;
            border: none !important;
            background: #e5e5ea !important;
            color: #222 !important;
            font-weight: 500;
            font-size: 1rem;
            padding: 0.45rem 1.1rem !important;
            margin-left: 0.5rem;
            margin-right: 0;
            box-shadow: none !important;
            transition: background 0.15s;
            pointer-events: auto !important;
            cursor: pointer !important;
            position: relative;
            z-index: 1000010 !important;
          }
          .apple-popover .driver-popover-end-btn:hover {
            background: #222 !important;
            color: #fff !important;
          }
          /* Skip button style */
          .tour-skip-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            border: none;
            background: transparent;
            cursor: pointer;
            color: #aaa;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 1000010 !important;
          }
          .tour-skip-btn:hover {
            background-color: #f2f2f2;
            color: #222;
          }
          .dark .tour-skip-btn:hover {
            background-color: #333;
            color: #eee;
          }

          /* Fix for Next button text */
          .driver-popover-next-btn::after {
            display: none !important;
          }

          /* Hide close button on last step */
          .apple-popover[data-last-step="true"] .driver-popover-close-btn {
            display: none !important;
          }
          
          /* Critical fixes for pointer events */
          #driver-page-overlay {
            pointer-events: auto !important;
          }
          .driver-active-element {
            pointer-events: auto !important;
            user-select: auto !important;
            z-index: 1000000 !important;
          }
          .driver-popover {
            pointer-events: auto !important;
            z-index: 1000001 !important;
          }
          .driver-popover-footer button, 
          .driver-popover-close-btn,
          .tour-skip-btn,
          .driver-popover-description button {
            pointer-events: auto !important;
            cursor: pointer !important;
          }
          .driver-popover-tip {
            pointer-events: none !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Add skip button functionality to the driver.js
      const addSkipButton = (isLastStep = false) => {
        setTimeout(() => {
          const popover = document.querySelector('.driver-popover');
          if (popover) {
            // Set data attribute for last step to control close button visibility
            if (isLastStep) {
              popover.setAttribute('data-last-step', 'true');
            }

            if (!document.querySelector('.tour-skip-btn')) {
              const skipBtn = document.createElement('button');
              skipBtn.className = 'tour-skip-btn';
              skipBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
              skipBtn.setAttribute('aria-label', 'Skip tour');
              skipBtn.title = 'Skip tour';
              skipBtn.onclick = endTour;
              popover.appendChild(skipBtn);
            }
            
            // Fix for buttons to ensure they are clickable
            const footer = popover.querySelector('.driver-popover-footer');
            if (footer) {
              const buttons = footer.querySelectorAll('button');
              buttons.forEach(button => {
                button.style.pointerEvents = 'auto';
                button.style.cursor = 'pointer';
                button.style.position = 'relative';
                button.style.zIndex = '1000010';
              });
            }
          }
        }, 100);
      };

      // Create the driver object with fixed configuration
      const driverObj = driver({
        showProgress: true,
        animate: true,
        smoothScroll: true,
        allowClose: false, // Disable built-in close button
        stagePadding: 5,
        stageRadius: 8,
        overlayOpacity: 0.6,
        overlayClickBehavior: 'close',
        disableActiveInteraction: false,
        progressText: '{{current}} / {{total}}',
        popoverClass: 'apple-popover',
        nextBtnText: 'Next',
        prevBtnText: 'Previous',
        doneBtnText: 'Done',
        steps: [
          {
            popover: {
              title: "Welcome to Contracts ✨",
              description: `<p>Your central hub for managing client contracts and agreements.</p><p>Let's take a quick tour.</p>`,
              align: "center",
            },
            onHighlighted: () => addSkipButton()
          },
          {
            element: "#content",
            popover: {
              title: "Contract Collection 📋",
              description: `<p>This is your contract hub where all your client agreements are stored and managed.</p><p>Each card shows essential information including signature status, which indicates whether contractors and clients have signed the document.</p>`,
              side: "top",
              align: "start",
            },
            onHighlighted: () => addSkipButton()
          },
          {
            element: ".flex.gap-2 a[href='/proposals']",
            popover: {
              title: "Create New Contracts 📝",
              description: `<p>Contracts are generated through proposals.</p><p>Click here to navigate to the proposals section where you can select an existing proposal or create a new one to generate a contract.</p>`,
              side: "bottom",
              align: "start",
            },
            onHighlighted: () => addSkipButton()
          },
          {
            popover: {
              title: "You're Ready! 🎉",
              description: `<div style='text-align:center;'>
                <p>You now know how to manage contracts in Simple Projex.</p>
                <p>Need this tour again? Click the Tour Guide button anytime.</p>
                <div style='display:flex;justify-content:center;margin-top:20px;'>
                  <button 
                    onclick='window.contractTourCreateCallback()' 
                    style='padding:8px 16px;border-radius:6px;background-color:#222;color:#fff;border:none;cursor:pointer;font-weight:500;font-size:1rem;'
                  >
                    Create your first contract
                  </button>
                </div>
              </div>`,
              align: "center",
              showButtons: ['previous'],
            },
            onHighlighted: () => addSkipButton(true)
          }
        ],
        onDestroyed: endTour
      });

      // Set up window callbacks for the buttons in the tour
      window.contractTourEndCallback = endTour;
      window.contractTourCreateCallback = redirectToCreateContract;

      // Start the tour
      driverObj.drive();
      
      // Cleanup function
      return () => {
        driverObj.destroy();
        delete window.contractTourEndCallback;
        delete window.contractTourCreateCallback;
      };
    }
  }, [isRunning, router]);

  return (
    isRunning ? (
      <div className="fixed top-2 right-2 z-[1000] hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={endTour}
                className="rounded-full p-2 bg-white/90 shadow-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:bg-zinc-800/90 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Skip tour</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ) : null
  );
}