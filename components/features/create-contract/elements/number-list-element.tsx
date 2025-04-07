"use client";

import { useState } from "react";
import { RichTextEditor } from "../utils/rich-text-editor";
import { ListItem, TextFormatting } from "../utils/types";
import { X, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/shared";

interface NumberListElementProps {
  content: {
    items: ListItem[];
  };
  onChange: (content: any) => void;
  formatting?: TextFormatting;
  onFormattingChange?: (formatting: TextFormatting) => void;
}

export const NumberListElement = ({ 
  content, 
  onChange, 
  formatting = { fontSize: 16 },
  onFormattingChange
}: NumberListElementProps) => {
  // Use local formatting only if global formatting is not provided
  const [localFormatting, setLocalFormatting] = useState<TextFormatting>({
    fontSize: 16,
  });

  // Determine which formatting to use (global or local)
  const activeFormatting = onFormattingChange ? formatting : localFormatting;
  const handleFormattingChange = onFormattingChange || setLocalFormatting;

  const updateItem = (id: string, text: string) => {
    const updatedItems = content.items.map((item) =>
      item.id === id ? { ...item, text } : item
    );
    onChange({ ...content, items: updatedItems });
  };

  const addItem = () => {
    const newItem: ListItem = { id: uuidv4(), text: "" };
    onChange({ ...content, items: [...content.items, newItem] });
  };

  const removeItem = (id: string) => {
    if (content.items.length <= 1) return;
    const updatedItems = content.items.filter((item) => item.id !== id);
    onChange({ ...content, items: updatedItems });
  };

  return (
    <div className="min-w-[300px]">
      <ol className="list-decimal pl-6">
        {content.items.map((item, index) => (
          <li key={item.id} className="mb-1 flex items-start group">
            <div className="flex-1">
              <RichTextEditor
                value={item.text}
                onChange={(text) => updateItem(item.id, text)}
                formatting={activeFormatting}
                onFormattingChange={handleFormattingChange}
                placeholder="List item"
                multiline={false}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-red-500 p-1 h-6 w-6 opacity-0 group-hover:opacity-100"
              disabled={content.items.length <= 1}
            >
              <X size={14} />
            </Button>
          </li>
        ))}
      </ol>
      <Button
        variant="ghost"
        size="sm"
        onClick={addItem}
        className="text-blue-500 flex items-center text-sm mt-1 h-7 px-2"
      >
        <Plus size={14} className="mr-1" /> Add item
      </Button>
    </div>
  );
};