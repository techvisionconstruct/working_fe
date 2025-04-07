"use client";

import { useRef, useEffect } from "react";
import { RichTextEditor } from "../utils/rich-text-editor";
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

  const handleTextChange = (text: string) => {
    onChange({ ...content, text });
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

  return (
    <div 
      ref={containerRef}
      className="w-full" 
      style={{ 
        minHeight: '80px',
        overflow: 'visible'
      }}
      data-element-id={element?.id}
    >
      <RichTextEditor
        value={content.text}
        onChange={handleTextChange}
        formatting={formatting}
        onFormattingChange={onFormattingChange}
        placeholder="Enter text here..."
        multiline={true}
      />
    </div>
  );
};