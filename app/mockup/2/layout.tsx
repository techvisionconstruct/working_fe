import type React from "react"
import "@/assets/style/globals.css"
import { Inter } from "next/font/google"
import { ThemeProviderClient } from "./components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Simple Projex - Professional Construction Proposal Builder",
  description:
    "Create stunning, detailed proposals for construction projects in minutes, not hours. Win more bids with Simple Projex.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={inter.className} 
        style={{
          backgroundColor: 'hsl(0, 0%, 100%)', 
          color: 'hsl(20, 10%, 15%)'
        }}
      >
        <ThemeProviderClient>
          {children}
        </ThemeProviderClient>
      </body>
    </html>
  )
}
