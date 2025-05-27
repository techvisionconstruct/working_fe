"use client"

import { useState, useEffect, ReactNode } from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProviderClient({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="simple-projex-theme"
    >
      {mounted ? children : 
        <div style={{ visibility: 'hidden' }}>{children}</div>
      }
    </NextThemeProvider>
  )
}
