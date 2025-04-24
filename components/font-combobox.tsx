import React from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button
} from "@/components/shared";
import Head from 'next/head';

// Font pairs derived from PageCloud's best Google font pairings
export const FONT_PAIRS = [
  { value: "playfair-source-sans", label: "Playfair Display / Source Sans Pro", heading: "'Playfair Display', serif", body: "'Source Sans Pro', sans-serif" },
  { value: "montserrat-hind", label: "Montserrat / Hind", heading: "'Montserrat', sans-serif", body: "'Hind', sans-serif" },
  { value: "montserrat-cardo", label: "Montserrat / Cardo", heading: "'Montserrat', sans-serif", body: "'Cardo', serif" },
  { value: "oswald-merriweather", label: "Oswald / Merriweather", heading: "'Oswald', sans-serif", body: "'Merriweather', serif" },
  { value: "nunito-pt-sans", label: "Nunito / PT Sans", heading: "'Nunito', sans-serif", body: "'PT Sans', sans-serif" },
  { value: "ubuntu-open-sans", label: "Ubuntu / Open Sans", heading: "'Ubuntu', sans-serif", body: "'Open Sans', sans-serif" },
  { value: "raleway-open-sans", label: "Raleway / Open Sans", heading: "'Raleway', sans-serif", body: "'Open Sans', sans-serif" },
  { value: "roboto-lora", label: "Roboto / Lora", heading: "'Roboto', sans-serif", body: "'Lora', serif" },
  { value: "fjalla-libre-baskerville", label: "Fjalla One / Libre Baskerville", heading: "'Fjalla One', sans-serif", body: "'Libre Baskerville', serif" },
  { value: "lustria-lato", label: "Lustria / Lato", heading: "'Lustria', serif", body: "'Lato', sans-serif" },
  { value: "cormorant-proza", label: "Cormorant Garamond / Proza Libre", heading: "'Cormorant Garamond', serif", body: "'Proza Libre', sans-serif" },
  { value: "abril-poppins", label: "Abril Fatface / Poppins", heading: "'Abril Fatface', serif", body: "'Poppins', sans-serif" },
  { value: "work-open-sans", label: "Work Sans / Open Sans", heading: "'Work Sans', sans-serif", body: "'Open Sans', sans-serif" },
  { value: "karla-inconsolata", label: "Karla / Inconsolata", heading: "'Karla', sans-serif", body: "'Inconsolata', monospace" },
  { value: "source-sans-source-serif", label: "Source Sans Pro / Source Serif Pro", heading: "'Source Sans Pro', sans-serif", body: "'Source Serif Pro', serif" }
];

// Map of font names to their Google Fonts URLs
const FONT_URLS = {
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
  'Source Sans Pro': 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap',
  'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap',
  'Hind': 'https://fonts.googleapis.com/css2?family=Hind:wght@400;500;700&display=swap',
  'Cardo': 'https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&display=swap',
  'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap',
  'Merriweather': 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap',
  'Nunito': 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap',
  'PT Sans': 'https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap',
  'Ubuntu': 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap',
  'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap',
  'Raleway': 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700&display=swap',
  'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap',
  'Lora': 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap',
  'Fjalla One': 'https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap',
  'Libre Baskerville': 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
  'Lustria': 'https://fonts.googleapis.com/css2?family=Lustria&display=swap',
  'Lato': 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&display=swap',
  'Cormorant Garamond': 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&display=swap',
  'Proza Libre': 'https://fonts.googleapis.com/css2?family=Proza+Libre:ital,wght@0,400;0,600;1,400&display=swap',
  'Abril Fatface': 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap',
  'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
  'Work Sans': 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;700&display=swap',
  'Karla': 'https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,400;0,700;1,400&display=swap',
  'Inconsolata': 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap',
  'Source Serif Pro': 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,700;1,400&display=swap'
};

// Helper function to extract font family names from CSS font-family string
const extractFontNames = (fontString: string): string[] => {
  return fontString
    .split(',')
    .map(font => font.trim().replace(/^['"]|['"]$/g, '')) // Remove quotes
    .filter(font => font !== 'serif' && font !== 'sans-serif' && font !== 'monospace'); // Filter out generic families
};

type FontComboboxProps = {
  onFontChange?: (heading: string, body: string) => void;
}

export function FontCombobox({ onFontChange }: FontComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("playfair-source-sans")
  const [loadedFonts, setLoadedFonts] = React.useState<string[]>([])

  const selectedFont = FONT_PAIRS.find((font) => font.value === value);

  // Get the font URLs that need to be loaded
  const getFontUrls = React.useCallback((headingFont: string, bodyFont: string) => {
    const headingFontNames = extractFontNames(headingFont);
    const bodyFontNames = extractFontNames(bodyFont);
    
    const urls: string[] = [];
    [...headingFontNames, ...bodyFontNames].forEach(fontName => {
      if (FONT_URLS[fontName as keyof typeof FONT_URLS] && !loadedFonts.includes(fontName)) {
        urls.push(FONT_URLS[fontName as keyof typeof FONT_URLS]);
      }
    });
    
    return urls;
  }, [loadedFonts]);

  React.useEffect(() => {
    if (selectedFont && onFontChange) {
      // Update the theme context with the new fonts
      onFontChange(selectedFont.heading, selectedFont.body);
      
      // Track which fonts are loaded
      const headingFontNames = extractFontNames(selectedFont.heading);
      const bodyFontNames = extractFontNames(selectedFont.body);
      
      setLoadedFonts(prev => {
        const newFonts = [...headingFontNames, ...bodyFontNames].filter(font => !prev.includes(font));
        return [...prev, ...newFonts];
      });

      // Apply fonts as inline styles
      document.documentElement.style.setProperty('--font-heading', selectedFont.heading);
      document.documentElement.style.setProperty('--font-body', selectedFont.body);
    }
  }, [selectedFont, onFontChange]);

  // Get URLs for fonts that need to be loaded
  const fontUrls = selectedFont 
    ? getFontUrls(selectedFont.heading, selectedFont.body)
    : [];

  return (
    <>
      {/* Dynamically load selected Google Fonts */}
      <Head>
        {fontUrls.map((url, index) => (
          <link key={index} rel="stylesheet" href={url} />
        ))}
      </Head>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[240px] justify-between bg-white/90 dark:bg-black/60 border border-gray-200 dark:border-gray-700 text-sm"
          >
            {selectedFont ? selectedFont.label : "Select font..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0">
          <Command>
            <CommandInput placeholder="Search font..." />
            <CommandList>
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup>
                {FONT_PAIRS.map((font) => (
                  <CommandItem
                    key={font.value}
                    value={font.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === font.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {font.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Global style to apply fonts throughout the application */}
      <style jsx global>{`
        :root {
          --font-heading: ${selectedFont?.heading || "'Inter', sans-serif"};
          --font-body: ${selectedFont?.body || "'Inter', sans-serif"};
        }
        
        h1, h2, h3, h4, h5, h6, .heading {
          font-family: var(--font-heading);
        }
        
        body, p, div, span, button, input, select, textarea, .body {
          font-family: var(--font-body);
        }
      `}</style>
    </>
  )
}