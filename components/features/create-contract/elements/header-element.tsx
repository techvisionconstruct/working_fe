"use client";

import { Input } from "@/components/shared";
import { TextFormatting } from "../utils/types";

interface HeaderElementProps {
  content: {
    text: string;
    level: number;
  };
  onChange: (content: any) => void;
  formatting?: TextFormatting;
  onFormattingChange?: (formatting: TextFormatting) => void;
}

export const HeaderElement = ({ 
  content, 
  onChange, 
  formatting = { fontSize: 24, bold: true }
}: HeaderElementProps) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...content, text: e.target.value });
  };

  // Compute text style based on formatting
  const textStyle = {
    fontSize: formatting.fontSize ? `${formatting.fontSize}px` : "24px",
    fontWeight: formatting.bold !== undefined ? (formatting.bold ? "bold" : "normal") : "bold",
    fontStyle: formatting.italic ? "italic" : "normal",
    textDecoration: formatting.underline ? "underline" : "none",
    color: formatting.color || "black",
    textAlign: formatting.alignment || "left",
  } as React.CSSProperties;

  return (
    <div className="w-full">
      <Input
        type="text"
        value={content.text}
        onChange={handleTextChange}
        className="w-full border-transparent focus:border-blue-300 py-2"
        style={textStyle}
        placeholder="Heading text"
      />
    </div>
  );
};