import { Sidenav } from "@/components/ui/sidebar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidenav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
