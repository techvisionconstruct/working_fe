"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/shared"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <header
      className="fixed top-0 z-50 w-full transition-all duration-300 text-white shadow"
      style={{
        borderBottom: '1px solid #9CA3AF',
        backgroundColor: 'hsl(0, 85%, 30%)',
        color: '#FFFFFF',
        boxShadow: '0 2px 8px 0 #9CA3AF22',
      }}
    >
      <div className="container flex h-20 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center gap-2 z-10">
          <Image
            src="https://i.ibb.co/LXR9NfMr/logo.png"
            alt="Simple ProjeX"
            width={40}
            height={40}
            className=""
            priority
            loading="eager"
            style={{ height: 'auto' }}
          />
          <span className="font-bold text-xl">Simple ProjeX</span>
        </Link>
        <nav className="hidden md:flex gap-6 z-10">
          <Link
            href="#features"
            className="text-sm font-medium transition-colors text-[#FFFFFF] hover:text-[#FF784E] focus:text-[#FF784E]"
          >
            Features
          </Link>
          <Link
            href="#industries"
            className="text-sm font-medium transition-colors text-[#FFFFFF] hover:text-[#FF784E] focus:text-[#FF784E]"
          >
            Industries
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium transition-colors text-[#FFFFFF] hover:text-[#FF784E] focus:text-[#FF784E]"
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium transition-colors text-[#FFFFFF] hover:text-[#FF784E] focus:text-[#FF784E]"
          >
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center gap-4 z-10">
          <Button
            variant="ghost"
            className="text-[#FFFFFF] hover:bg-white/10"
            style={{ color: '#FFFFFF' }}
          >
            Log in
          </Button>
          <Button
            className="bg-[#FFFFFF] text-[#8B0000] hover:bg-white/90"
            style={{ backgroundColor: '#FFFFFF', color: 'hsl(0, 85%, 30%)' }}
          >
            Schedule a Demo
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-[#FFFFFF]">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
