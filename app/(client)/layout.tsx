import { Sidenav } from "@/components/ui/sidebar/sidebar";
import { MobileHeader } from "@/components/ui/sidebar/mobile-header";
import { MobileSidebar } from "@/components/ui/sidebar/mobile-sidebar";
import { TanstackProvider } from "@/providers/tanstack-provider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <TanstackProvider>
        <div className="hidden md:block w-auto shrink-0"></div>
        <main className="flex-1 overflow-auto">
          <div className="block md:hidden"></div>

          <div className="relative z-0 p-6">{children}</div>
        </main>
      </TanstackProvider>
    </div>
  );
}
