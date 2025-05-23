import React, { useEffect, useRef } from "react";

type FontComboboxProps = {
  value: string;
  onFontChange: (font: { fontFamily: string }) => void;
};

export function FontCombobox({ value, onFontChange }: FontComboboxProps) {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [value]);

  const fonts = [
    { label: "Inter", value: "Inter, sans-serif" },
    { label: "Roboto", value: "Roboto, sans-serif" },
    { label: "Montserrat", value: "Montserrat, sans-serif" },
    { label: "Playfair Display", value: "'Playfair Display', serif" },
    { label: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
    { label: "Lora", value: "'Lora', serif" },
    { label: "Poppins", value: "'Poppins', sans-serif" },
    // ...add more as needed
  ];

  return (
    <div style={{ maxHeight: 200, overflowY: "auto" }}>
      {fonts.map((font) => (
        <div
          key={font.value}
          ref={font.value === value ? selectedRef : null}
          style={{
            fontFamily: font.value,
            background: font.value === value ? "#e11d48" : "transparent",
            color: font.value === value ? "#fff" : "#191919",
            padding: "8px 12px",
            cursor: "pointer",
            borderRadius: 6,
            marginBottom: 2,
          }}
          onClick={() => onFontChange({ fontFamily: font.value })}
        >
          {font.label}
        </div>
      ))}
    </div>
  );
}
