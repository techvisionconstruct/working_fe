"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CalendarCheck2, LogIn, CheckCircle, Play } from "lucide-react";
import { Badge, Button } from "@/components/shared";
import VideoDialog from "@/components/mockup/landing-page/video-dialog";
import { PopupModal } from "react-calendly";

export default function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_CALENDLY_URL;
    if (url) {
      setCalendlyUrl(url);
    }
  }, []);
  
  return (
    <section className="flex justify-center mx-auto w-full py-10">
      <div className="container max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="rounded-full mb-1.5 w-fit py-1.5 px-4 text-sm"
              >
                Welcome To Simple ProjeX
              </Badge>
              <h1 className="text-6xl tracking-tighter leading-tight">
                Less Paper, More Work <br />
                Lock the Job in 5 Steps <br />
                Start Building Smarter
              </h1>
              <p className="max-w-[550px] text-gray-500 md:text-base dark:text-gray-400"></p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button 
                className="py-4 px-6 rounded-full"
                onClick={() => setIsCalendlyOpen(true)}
              >
                <div className="text-base font-light">Schedule A Demo</div>
                <CalendarCheck2 className="!w-4.5 !h-4.5 ml-1.5" strokeWidth={1.5} />
              </Button>
              <Button variant="outline" className="py-4 px-6 rounded-full">
                <div className="text-base font-light">Login</div>
                <LogIn className="!w-4.5 !h-4.5 ml-1.5" strokeWidth={1.5} />
              </Button>
            </div>

            {/* Different cards below buttons */}
            <div className="flex flex-col gap-3 mt-32">
              {/* Ratings Card */}
              <div className="border-l-4 border-l-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg mb-1">Client Ratings</h3>
                    <p className="text-gray-600 text-sm mb-1">
                      Trusted by thousands of contractors
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="#333333"
                          stroke="#333333"
                          strokeWidth="1.5"
                          className="ml-1"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-3 font-semibold text-sm">4.8/5</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-medium text-lg">Watch How It Works</h3>
                    <p className="text-gray-200 text-sm">
                      See Simple ProjeX in action - 2 min demo
                    </p>
                  </div>
                  <Button
                    className="ml-auto bg-white rounded-full hover:bg-gray-200 py-2 px-2.5"
                    onClick={() => setIsVideoOpen(true)}
                  >
                    <Play className="text-black h-4 w-4"/>
                  </Button>
                </div>
                <div className="w-full h-36 bg-gray-200">
                  <Image
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Demo Video Thumbnail"
                    width={800}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-fit max-w-full">
              <div className="absolute inset-0 bg-black/10 rounded-xl z-20"></div>
              <Image
                src="https://images.unsplash.com/photo-1601074231509-dce351c05199?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNvbnN0cnVjdGlvbnxlbnwwfDF8MHx8fDI%3D"
                alt="Project Management Dashboard"
                width={650}
                height={360}
                className="object-cover rounded-xl relative z-10 h-auto max-h-[750px]"
              />
            </div>
          </div>
        </div>
      </div>

      <VideoDialog
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoId="dQw4w9WgXcQ"
      />

      {calendlyUrl && (
        <PopupModal
          url={calendlyUrl}
          onModalClose={() => setIsCalendlyOpen(false)}
          open={isCalendlyOpen}
          rootElement={document?.body}
        />
      )}
    </section>
  );
}
