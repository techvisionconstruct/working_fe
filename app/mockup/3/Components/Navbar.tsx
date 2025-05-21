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
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 text-foreground"
          : "bg-transparent text-white"
      }`}
      style={{
        borderColor: scrolled ? 'hsla(20, 10%, 90%, 0.4)' : 'transparent'
      }}
    >
      <div className="container flex h-20 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center gap-2 z-10">
          <Image
            src="https://i.ibb.co/LXR9NfMr/logo.png"
            alt="Simple ProjeX"
            width={40}
            height={40}
            className={scrolled ? "" : "invert"}
            priority
            loading="eager"
            style={{ height: 'auto' }}
          />
          <span className="font-bold text-xl">Simple ProjeX</span>
        </Link>
        <nav className="hidden md:flex gap-6 z-10">
          <Link
            href="#features"
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"
            }`}
          >
            Features
          </Link>
          <Link
            href="#industries"
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"
            }`}
          >
            Industries
          </Link>
          <Link
            href="#pricing"
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"
            }`}
          >
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center gap-4 z-10">
          <Button
            variant="ghost"
            className={scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}
          >
            Log in
          </Button>
          <Button
            className={
              scrolled ? "bg-primary text-white hover:bg-primary/90" : "bg-white text-primary hover:bg-white/90"
            }
            style={{
              backgroundColor: scrolled ? 'hsl(0, 85%, 30%)' : 'white',
              color: scrolled ? 'white' : 'hsl(0, 85%, 30%)'
            }}
          >
            Schedule a demo
          </Button>
          <Button variant="ghost" size="icon" className={`md:hidden ${scrolled ? "text-foreground" : "text-white"}`}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
