"use client";

import { useCallback } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/shared";
import { PageSize } from "./utils/types";

interface PageSizeSelectorProps {
  currentSize: PageSize;
  onSizeChange: (size: PageSize) => void;
}

export const PageSizeSelector = ({ 
  currentSize, 
  onSizeChange 
}: PageSizeSelectorProps) => {
  // Use a callback to handle selection changes instead of directly passing the event
  const handleSizeChange = useCallback((value: string) => {
    onSizeChange(value as PageSize);
  }, [onSizeChange]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Page Size:</span>
      <Select 
        value={currentSize} 
        onValueChange={handleSizeChange}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a4">A4</SelectItem>
          <SelectItem value="letter">Letter</SelectItem>
          <SelectItem value="legal">Legal</SelectItem>
          <SelectItem value="short">Short Form</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};