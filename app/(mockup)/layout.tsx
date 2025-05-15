import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanstackProvider } from "@/providers/tanstack-provider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TanstackProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
        {/* <Navbar /> */}
        <main className="">{children}</main>
      </TanstackProvider>
    </div>
  );
}
