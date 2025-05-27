import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Define a type for the color swatch
export type ColorSwatch = {
  background: string;
  foreground: string;
  accent: string;
  card: string;
  cardDark: string;
  border: string;
  logoLight: string;
  logoDark: string;
  isDarkDefault?: boolean;  // Flag to indicate if this swatch is dark by default
  lightModeBackground?: string; // Optional override for light mode
  lightModeForeground?: string; // Optional override for light mode
  lightModeCard?: string;  // Optional override for light mode
};

// Define a type for font pairing
export type FontPairing = {
  heading: string;
  body: string;
};

// Add an index signature to COLOR_SWATCHES
const COLOR_SWATCHES: Record<string, ColorSwatch> = {
  palette1: {
    background: "#E0E1DD",
    foreground: "#0D1B2A",
    accent: "#778DA9",
    card: "#415A77",
    cardDark: "#1B263B",
    border: "#778DA9",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
  },
  palette2: {
    background: "#DAD7CD",
    foreground: "#344E41",
    accent: "#588157",
    card: "#A3B18A",
    cardDark: "#3A5A40",
    border: "#344E41",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
  },
  palette3: {
    background: "#FFFFFF",
    foreground: "#14213D",
    accent: "#FCA311",
    card: "#E5E5E5",
    cardDark: "#000000",
    border: "#FCA311",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
  },
  default: {
    background: "#ffffff",
    foreground: "#191919",
    accent: "#20b8cd",
    card: "#f8fafc",
    cardDark: "#23272e",
    border: "#e5e7eb",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
  },
  blue: {
    background: "#eaf6ff",
    foreground: "#0a2540",
    accent: "#0070f3",
    card: "#f0f6fc",
    cardDark: "#1a2233",
    border: "#b6d0e2",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
  },
  midnightBlue: {
    background: "#232B3B", // deep blue, not black
    foreground: "#E6ECF1", // soft off-white
    accent: "#4F8CFF", // vibrant blue accent
    card: "#2D3A53", // lighter blue for cards
    cardDark: "#1A2233", // slightly darker for dark mode
    border: "#3A4A6B",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
    isDarkDefault: true,
    lightModeBackground: "#E6ECF1", // Invert colors for light mode
    lightModeForeground: "#232B3B",
    lightModeCard: "#D8E1ED"
  },
  twitterDim: {
    background: "#15202B",
    foreground: "#D7DBDF",
    accent: "#1DA1F2",
    card: "#192734",
    cardDark: "#22303C",
    border: "#38444D",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
    isDarkDefault: true,
    lightModeBackground: "#FFFFFF",
    lightModeForeground: "#15202B",
    lightModeCard: "#F7F9FA"
  },
  sageGreen: {
    background: "#F4F6F3",
    foreground: "#2E3A32",
    accent: "#7BAE7F",
    card: "#E0E7DF",
    cardDark: "#B7C7B0",
    border: "#A3B9A5",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
  },
  sunsetCoral: {
    background: "#FFF6F0",
    foreground: "#2D1A14",
    accent: "#FF6F61",
    card: "#FFE3D6",
    cardDark: "#FFBFA3",
    border: "#FF6F61",
    logoLight: "/icons/logo.svg",
    logoDark: "/icons/logo.svg",
  },
};

// Utility to determine readable text color based on background
function getReadableTextColor(bgColor: string, fallback: string = '#191919'): string {
  // Simple luminance check for light/dark backgrounds
  if (!bgColor) return fallback;
  let color = bgColor.replace('#', '');
  if (color.length === 3) color = color.split('').map(x => x + x).join('');
  if (color.length !== 6) return fallback;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  // Perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#191919' : '#fff';
}

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  swatch: string;
  setSwatch: (swatch: string) => void;
  colors: ColorSwatch & {
    readableForeground: string;
    readableCard: string;
    readableCardDark: string;
  };
  fonts: FontPairing;
  setFonts: (heading: string, body: string) => void;
}

const defaultContextValue: ThemeContextType = {
  theme: "light",
  setTheme: () => {},
  swatch: "default",
  setSwatch: () => {},
  colors: {
    ...COLOR_SWATCHES.default,
    readableForeground: getReadableTextColor(COLOR_SWATCHES.default.background),
    readableCard: getReadableTextColor(COLOR_SWATCHES.default.card),
    readableCardDark: getReadableTextColor(COLOR_SWATCHES.default.cardDark),
  },
  fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  setFonts: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default values
  const [theme, setThemeState] = useState<string>("light");
  const [swatch, setSwatchState] = useState<string>("default");
  const [fonts, setFontState] = useState<FontPairing>({ 
    heading: "'Inter', sans-serif", 
    body: "'Inter', sans-serif" 
  });
  
  // Use color swatch from state and apply dark mode adjustments if needed
  const colors = React.useMemo(() => {
    const baseSwatch = COLOR_SWATCHES[swatch] || COLOR_SWATCHES.default;
    
    // Handle dark-by-default swatches specially in light mode
    if (theme === "light" && baseSwatch.isDarkDefault) {
      return {
        // Use light mode overrides if provided, otherwise calculate sensible defaults
        background: baseSwatch.lightModeBackground || "#ffffff",
        foreground: baseSwatch.lightModeForeground || baseSwatch.foreground,
        accent: baseSwatch.accent,
        card: baseSwatch.lightModeCard || "#f8fafc",
        cardDark: baseSwatch.cardDark,
        border: baseSwatch.border,
        logoLight: baseSwatch.logoLight,
        logoDark: baseSwatch.logoDark,
        readableForeground: getReadableTextColor(baseSwatch.lightModeBackground || "#ffffff"),
        readableCard: getReadableTextColor(baseSwatch.lightModeCard || "#f8fafc"),
        readableCardDark: getReadableTextColor(baseSwatch.cardDark),
      };
    }
    // If in dark mode, invert some colors while keeping the palette identity
    else if (theme === "dark") {
      return {
        // In dark mode, swap background with cardDark
        background: baseSwatch.cardDark,
        // Keep foreground color but ensure it's readable on dark background
        foreground: getReadableTextColor(baseSwatch.cardDark, '#ffffff'),
        // Keep accent color for brand consistency
        accent: baseSwatch.accent,
        // Use darker card backgrounds in dark mode
        card: baseSwatch.cardDark,
        cardDark: baseSwatch.cardDark,
        // Adjust border to be visible on dark background
        border: baseSwatch.border,
        // Use appropriate logo for dark mode
        logoLight: baseSwatch.logoLight,
        logoDark: baseSwatch.logoDark,
        // Calculate readable text colors for various backgrounds
        readableForeground: getReadableTextColor(baseSwatch.cardDark, '#ffffff'),
        readableCard: getReadableTextColor(baseSwatch.cardDark, '#ffffff'),
        readableCardDark: getReadableTextColor(baseSwatch.cardDark, '#ffffff'),
      };
    }
    
    // Regular light mode - use original colors
    return {
      ...baseSwatch,
      readableForeground: getReadableTextColor(baseSwatch.background),
      readableCard: getReadableTextColor(baseSwatch.card),
      readableCardDark: getReadableTextColor(baseSwatch.cardDark),
    };
  }, [theme, swatch]);

  // Memoize setters to prevent recreating functions on every render
  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
  }, []);

  const setSwatch = useCallback((newSwatch: string) => {
    setSwatchState(newSwatch);
  }, []);

  const setFonts = useCallback((heading: string, body: string) => {
    setFontState({ heading, body });
  }, []);

  // Apply theme, colors, and font changes to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Toggle dark class for Tailwind dark mode
      document.documentElement.classList.toggle("dark", theme === "dark");
      
      // Apply colors to CSS variables
      document.documentElement.style.setProperty('--background', colors.background);
      document.documentElement.style.setProperty('--foreground', colors.foreground);
      document.documentElement.style.setProperty('--accent', colors.accent);
      document.documentElement.style.setProperty('--card', colors.card);
      document.documentElement.style.setProperty('--card-dark', colors.cardDark);
      document.documentElement.style.setProperty('--border', colors.border);
      
      // Apply fonts to CSS variables
      document.documentElement.style.setProperty('--font-heading', fonts.heading);
      document.documentElement.style.setProperty('--font-body', fonts.body);
    }
  }, [theme, colors, fonts]);

  // Create memoized context value to prevent unnecessary rerenders
  const contextValue = React.useMemo(() => ({
    theme,
    setTheme,
    swatch,
    setSwatch,
    colors,
    fonts,
    setFonts
  }), [theme, setTheme, swatch, setSwatch, colors, fonts, setFonts]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
