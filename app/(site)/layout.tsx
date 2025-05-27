import { Sidenav } from "@/components/ui/sidebar/sidebar";
import { MobileHeader } from "@/components/ui/sidebar/mobile-header";
import { MobileSidebar } from "@/components/ui/sidebar/mobile-sidebar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanstackProvider } from "@/providers/tanstack-provider";
import { UserProvider } from "@/providers/user-provider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <TanstackProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
        <UserProvider>
          <div className="hidden md:block w-auto shrink-0">
            <Sidenav />
          </div>
          <main className="flex-1 overflow-auto">
            <div className="block md:hidden">
              <MobileHeader />
            </div>
            <MobileSidebar />
            <div className="relative z-0 p-6">{children}</div>
          </main>
        </UserProvider>
      </TanstackProvider>
    </div>
  );
}
