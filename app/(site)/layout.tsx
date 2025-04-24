import { Sidenav } from "@/components/ui/sidebar/sidebar";
import { MobileHeader } from "@/components/ui/sidebar/mobile-header";
import { MobileSidebar } from "@/components/ui/sidebar/mobile-sidebar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Sidebar: hidden on mobile, shown on desktop */}
      <div className="hidden md:block w-auto shrink-0">
        <Sidenav />
      </div>
      <main className="flex-1 overflow-auto">
        {/* Mobile header: shown on mobile, hidden on desktop */}
        <div className="block md:hidden">
          <MobileHeader />
        </div>
        {/* Mobile sidebar overlay - always rendered but only visible when opened */}
        <MobileSidebar />
        {/* Content area */}
        <div className="relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
