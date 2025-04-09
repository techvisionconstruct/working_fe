"use client";

import { useRef, useEffect, useState } from "react";
import { TipTapEditor } from "../utils/tiptap-editor";
import { TextFormatting } from "../utils/types";

interface TextElementProps {
  content: {
    text: string;
  };
  onChange: (content: any) => void;
  element?: { id: string };
  formatting?: TextFormatting;
  onFormattingChange?: (formatting: TextFormatting) => void;
}

export const TextElement = ({ 
  content, 
  onChange, 
  element,
  formatting = { fontSize: 16 },
  onFormattingChange
}: TextElementProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (html: string) => {
    onChange({ ...content, text: html });
  };
  
  // Add an effect to ensure the container triggers resize events properly
  useEffect(() => {
    if (containerRef.current) {
      // Force a layout update whenever text content changes
      const observer = new ResizeObserver(() => {
        // This will notify parent components about size changes
        if (element?.id) {
          const event = new CustomEvent('elementresized', { 
            bubbles: true,
            detail: { id: element.id, height: containerRef.current?.offsetHeight || 0 }
          });
          containerRef.current?.dispatchEvent(event);
        }
      });
      
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [content.text, element?.id]);

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Apply formatting styles to the container
  const textStyle: React.CSSProperties = {
    fontWeight: formatting?.bold ? "bold" : "normal",
    fontStyle: formatting?.italic ? "italic" : "normal",
    textDecoration: formatting?.underline ? "underline" : "none",
    color: formatting?.color || "#000000",
    fontSize: `${formatting?.fontSize || 16}px`,
    textAlign: formatting?.alignment || "left",
    lineHeight: "1.35" // Add consistent line height for better spacing
  };

  return (
    <div 
      ref={containerRef}
      className="w-full transition-colors"
      style={{ 
        minHeight: '22px', // Reduced from 30px for even more compact rows
        overflow: 'visible',
        margin: '0', // Remove margin
        wordWrap: 'break-word', // Ensure text wraps properly
        overflowWrap: 'break-word', // Modern browsers
        whiteSpace: 'pre-wrap', // Preserve whitespace but wrap text
        width: '100%', // Ensure full width
        boxSizing: 'border-box', // Include padding in width calculation
        ...textStyle // Apply formatting styles to the container
      }}
      data-element-id={element?.id}
    >
      <TipTapEditor
        value={content.text}
        onChange={handleTextChange}
        formatting={formatting}
        onFormattingChange={onFormattingChange}
        placeholder="Enter text here..."
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};