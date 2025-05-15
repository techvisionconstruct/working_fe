import { Sidenav } from "@/components/ui/sidebar/sidebar";
import { MobileHeader } from "@/components/ui/sidebar/mobile-header";
import { MobileSidebar } from "@/components/ui/sidebar/mobile-sidebar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanstackProvider } from "@/providers/tanstack-provider";
import Navbar from "../components/nav-bar-2";
import { UserProvider } from "@/components/mockup/providers/user-provider";

export default function OnboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UserProvider>
        <Navbar />
        <main className="container mx-auto py-4">{children}</main>
      </UserProvider>
    </div>
  );
}
