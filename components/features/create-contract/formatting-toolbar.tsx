"use client";

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared";
import { TextFormatting } from "./utils/types";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";

interface FormattingToolbarProps {
  formatting: TextFormatting;
  onFormattingChange: (formatting: TextFormatting) => void;
  isDisabled?: boolean;
  activeElementType?: string;
  onHeaderLevelChange?: (level: number) => void;
  headerLevel?: number;
}

export const FormattingToolbar = ({ 
  formatting, 
  onFormattingChange,
  isDisabled = false,
  activeElementType,
  onHeaderLevelChange,
  headerLevel = 1
}: FormattingToolbarProps) => {
  
  const toggleFormatting = (property: keyof TextFormatting) => {
    if (isDisabled) return;
    
    const newFormatting = { ...formatting };
    if (typeof newFormatting[property] === "boolean") {
      newFormatting[property] = !newFormatting[property] as any;
    }
    onFormattingChange(newFormatting);
  };
  
  const setAlignment = (alignment: "left" | "center" | "right") => {
    if (isDisabled) return;
    // Set both alignment and textAlign properties for compatibility
    onFormattingChange({ ...formatting, alignment, textAlign: alignment });
  };
  
  const setFontSize = (fontSize: number) => {
    if (isDisabled) return;
    onFormattingChange({ ...formatting, fontSize });
  };
  
  const setColor = (color: string) => {
    if (isDisabled) return;
    onFormattingChange({ ...formatting, color });
  };

  const isHeaderSelected = activeElementType === "header";
  
  return (
    <div className={`flex items-center space-x-2 ${isDisabled ? "opacity-50" : ""}`}>
      <div className="text-sm text-gray-500 font-medium mr-2">
        {isDisabled ? "Select element to format" : "Text Formatting"}
      </div>
      
      {/* Header Level Selector - only shown when a header is selected */}
      {isHeaderSelected && onHeaderLevelChange && (
        <>
          <Select
            value={String(headerLevel)}
            onValueChange={(value) => onHeaderLevelChange(Number(value))}
            disabled={isDisabled}
          >
            <SelectTrigger className="h-8 w-16 text-xs">
              <div className="flex items-center justify-center gap-1">
                <Type size={14} className="flex-shrink-0" />
                <span>H{headerLevel}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1</SelectItem>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
              <SelectItem value="4">H4</SelectItem>
            </SelectContent>
          </Select>
          <div className="h-8 w-px bg-gray-300 mx-1"></div>
        </>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className={`p-1 h-8 w-8 ${formatting.bold ? "bg-blue-100" : ""}`}
        onClick={() => toggleFormatting("bold")}
        title="Bold"
        disabled={isDisabled}
      >
        <Bold size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`p-1 h-8 w-8 ${formatting.italic ? "bg-blue-100" : ""}`}
        onClick={() => toggleFormatting("italic")}
        title="Italic"
        disabled={isDisabled}
      >
        <Italic size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`p-1 h-8 w-8 ${formatting.underline ? "bg-blue-100" : ""}`}
        onClick={() => toggleFormatting("underline")}
        title="Underline"
        disabled={isDisabled}
      >
        <Underline size={16} />
      </Button>
      
      <div className="h-8 w-px bg-gray-300 mx-1"></div>
      
      <Button
        variant="ghost"
        size="sm"
        className={`p-1 h-8 w-8 ${formatting.alignment === "left" ? "bg-blue-100" : ""}`}
        onClick={() => setAlignment("left")}
        title="Align Left"
        disabled={isDisabled}
      >
        <AlignLeft size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`p-1 h-8 w-8 ${formatting.alignment === "center" ? "bg-blue-100" : ""}`}
        onClick={() => setAlignment("center")}
        title="Align Center"
        disabled={isDisabled}
      >
        <AlignCenter size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`p-1 h-8 w-8 ${formatting.alignment === "right" ? "bg-blue-100" : ""}`}
        onClick={() => setAlignment("right")}
        title="Align Right"
        disabled={isDisabled}
      >
        <AlignRight size={16} />
      </Button>
      
      <div className="h-8 w-px bg-gray-300 mx-1"></div>
      
      <Select
        value={String(formatting.fontSize || 16)}
        onValueChange={(value) => setFontSize(Number(value))}
        disabled={isDisabled}
      >
        <SelectTrigger className="h-8 w-16 text-xs">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="h-8 w-px bg-gray-300 mx-1"></div>
      
      <input
        type="color"
        value={formatting.color || "#000000"}
        onChange={(e) => setColor(e.target.value)}
        className="w-8 h-8 p-1 border rounded"
        title="Text Color"
        disabled={isDisabled}
      />
    </div>
  );
};