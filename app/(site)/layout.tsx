import { Sidenav } from "@/components/ui/sidebar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <div className="w-full md:w-auto shrink-0">
        <Sidenav />
      </div>
      <main className="flex-1 overflow-auto px-4 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
