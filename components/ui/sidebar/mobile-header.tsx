"use client";
import Image from "next/image";

export function MobileHeader() {
  return (
    <div className="block md:hidden sticky top-0 z-[150] bg-background/80 backdrop-blur border-b border-border shadow-sm">
      <div className="flex items-center h-16 px-5 gap-3 relative">
        {/* Hamburger button triggers a custom event for Sidenav to open */}
        <button
          className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring shadow"
          aria-label="Open sidebar"
          onClick={() => window.dispatchEvent(new CustomEvent('open-sidenav'))}
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="12" x2="24" y2="12"/><line x1="4" y1="6" x2="24" y2="6"/><line x1="4" y1="18" x2="24" y2="18"/></svg>
        </button>
        <Image
          src="/icons/logo.svg"
          alt="Projex Logo"
          width={38}
          height={38}
          className="object-contain ml-2 drop-shadow"
        />
        <div className="flex flex-col justify-center ml-2">
          <span className="text-muted-foreground uppercase tracking-wide text-xs leading-none font-semibold" style={{fontFamily: 'DM Sans, sans-serif'}}>SIMPLE</span>
          <span className="font-bold text-xl text-sidebar-foreground uppercase leading-tight tracking-wider" style={{fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.09rem'}}>PROJEX</span>
        </div>
      </div>
    </div>
  );
}
