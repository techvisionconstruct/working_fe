"use client";

import { useRef, useState, useCallback } from "react";
import { TipTapEditor } from "../utils/tiptap-editor";
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
  formatting = { fontSize: 24, bold: true },
  onFormattingChange
}: HeaderElementProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const handleTextChange = (html: string) => {
    // Strip HTML tags for the header since we want to keep it as simple text
    // but still allow formatting properties to be applied
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    onChange({ ...content, text: plainText });
  };
  
  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  
  // Get appropriate header tag based on level
  const getHeaderTag = () => {
    switch(content.level) {
      case 1: return 'h1';
      case 2: return 'h2'; 
      case 3: return 'h3';
      default: return 'h1';
    }
  };
  
  // Convert plain text to HTML for the editor
  const getEditorContent = () => {
    const tag = getHeaderTag();
    return content.text ? `<${tag}>${content.text}</${tag}>` : '';
  };

  // Add more precise font size mapping to match PDF output exactly
  const getFontSize = () => {
    switch(content.level) {
      case 1: return { fontSize: 24 }; // H1 header
      case 2: return { fontSize: 20 }; // H2 header
      case 3: return { fontSize: 18 }; // H3 header
      default: return { fontSize: 24 };
    }
  };
  
  // Get the appropriate font size for this header level
  const levelSpecificFormatting = getFontSize();
  
  // Create a stable formatting object that doesn't change on every render
  // This is crucial to prevent the infinite update loop
  const mergedFormatting = useCallback(() => ({
    ...formatting,
    fontSize: levelSpecificFormatting.fontSize,
    bold: true // Headers should always be bold
  }), [formatting, levelSpecificFormatting.fontSize])();
  
  // Skip automatic formatting updates from the editor
  // This breaks the circular update chain that causes the infinite loop
  const handleFormattingChange = useCallback((newFormatting: TextFormatting) => {
    if (!onFormattingChange) return;
    
    // Only pass through formatting changes that aren't related to the header level
    // (like color, alignment, etc.) but preserve the level-specific fontSize
    onFormattingChange({
      ...newFormatting,
      fontSize: levelSpecificFormatting.fontSize,
      bold: true
    });
  }, [onFormattingChange, levelSpecificFormatting.fontSize]);

  return (
    <div 
      ref={containerRef}
      className={`w-full transition-colors ${isFocused ? 'bg-blue-50 rounded' : ''}`}
    >
      <TipTapEditor
        value={getEditorContent()}
        onChange={handleTextChange}
        formatting={mergedFormatting}
        onFormattingChange={onFormattingChange}
        placeholder="Header text..."
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};