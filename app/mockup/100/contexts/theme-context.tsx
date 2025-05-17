import React, { createContext, useContext, useState } from "react";

const PALETTES = {
  red: {
    name: "Red",
    primary: "#e11d48",
    background: "#fff",
    text: "#191919",
    accent: "#fff0f3",
  },
  blue: {
    name: "Blue",
    primary: "#2563eb",
    background: "#fff",
    text: "#191919",
    accent: "#e0e7ff",
  },
  green: {
    name: "Green",
    primary: "#16a34a",
    background: "#fff",
    text: "#191919",
    accent: "#dcfce7",
  },
  dark: {
    name: "Dark",
    primary: "#e11d48",
    background: "#191919",
    text: "#fff",
    accent: "#23272e",
  },
} as const;

export type PaletteKey = keyof typeof PALETTES;

type ThemeContextType = {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  palette: PaletteKey;
  setPalette: React.Dispatch<React.SetStateAction<PaletteKey>>;
  fonts: { fontFamily: string };
  setFonts: React.Dispatch<React.SetStateAction<{ fontFamily: string }>>;
  colors: (typeof PALETTES)[PaletteKey];
  palettes: typeof PALETTES;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

import { ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState<PaletteKey>("red");
  const [fonts, setFonts] = useState<{ fontFamily: string }>({
    fontFamily: "Inter, sans-serif",
  });

  // Merge palette and dark mode
  const paletteColors =
    theme === "dark" ? PALETTES["dark"] : PALETTES[palette] || PALETTES["red"];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        palette,
        setPalette,
        fonts,
        setFonts,
        colors: paletteColors,
        palettes: PALETTES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
