import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/style/globals.css";
import SidenavWrapper from "@/components/ui/sidenav-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Projex",
  description:
    "A partner-specific web application focused on streamlining the creation of proposals and contracts through a template-based system.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">
          <SidenavWrapper />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}