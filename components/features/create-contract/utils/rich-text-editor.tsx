"use client";

import { useCallback, useRef, useEffect } from "react";
import { Textarea, Input } from "@/components/shared";
import { TextFormatting } from "./types";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string, formatting?: TextFormatting) => void;
  formatting?: TextFormatting;
  onFormattingChange?: (formatting: TextFormatting) => void;
  placeholder?: string;
  multiline?: boolean;
}

export const RichTextEditor = ({
  value,
  onChange,
  formatting = {},
  onFormattingChange,
  placeholder = "Type something...",
  multiline = true,
}: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Function to adjust textarea height based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Set the height to scrollHeight to expand the textarea
    textarea.style.height = `${textarea.scrollHeight}px`;
    
    // Dispatch custom event to notify parent components of size change
    const event = new CustomEvent('elementresized', { 
      bubbles: true,
    });
    textarea.dispatchEvent(event);
  }, []);
  
  // Adjust height when value changes
  useEffect(() => {
    if (multiline) {
      adjustTextareaHeight();
    }
  }, [value, multiline, adjustTextareaHeight, formatting]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
    // For textarea, adjust height after content change
    if (multiline && e.target instanceof HTMLTextAreaElement) {
      setTimeout(adjustTextareaHeight, 0);
    }
  };

  // Handle key events for keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+B, Ctrl+I, Ctrl+U - formatting shortcuts
    if (e.ctrlKey && onFormattingChange && (e.key === 'b' || e.key === 'i' || e.key === 'u')) {
      e.preventDefault();
      
      const newFormatting = { ...formatting };
      if (e.key === 'b') newFormatting.bold = !newFormatting.bold;
      if (e.key === 'i') newFormatting.italic = !newFormatting.italic;
      if (e.key === 'u') newFormatting.underline = !newFormatting.underline;
      
      onFormattingChange(newFormatting);
    }
  };

  // Style based on formatting
  const textStyle: React.CSSProperties = {
    fontWeight: formatting.bold ? "bold" : "normal",
    fontStyle: formatting.italic ? "italic" : "normal",
    textDecoration: formatting.underline ? "underline" : "none",
    color: formatting.color || "#000000",
    fontSize: `${formatting.fontSize || 16}px`,
  };

  // Handle alignment separately to ensure it works properly
  if (formatting.alignment) {
    textStyle.textAlign = formatting.alignment;
  } else if (formatting.textAlign) {
    textStyle.textAlign = formatting.textAlign;
  }
  
  return (
    <div className="relative w-full">
      {multiline ? (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full min-h-[80px] border-transparent focus:border-blue-300 p-2"
          style={{
            ...textStyle,
            width: "100%",
            overflow: "hidden", // Prevent scrollbar
            resize: "none",     // Disable manual resizing
          }}
          onInput={adjustTextareaHeight}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full border-transparent focus:border-blue-300"
          style={{
            ...textStyle,
            width: "100%"
          }}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};