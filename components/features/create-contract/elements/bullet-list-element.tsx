"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";
import { Button, Input } from "@/components/shared";
import { ListItem, TextFormatting } from "../utils/types";

interface BulletListElementProps {
  content: {
    items: ListItem[];
  };
  onChange: (content: any) => void;
  formatting?: TextFormatting;
  onFormattingChange?: (formatting: TextFormatting) => void;
}

export const BulletListElement = ({ 
  content, 
  onChange,
  formatting = { fontSize: 16 }
}: BulletListElementProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleAddItem = () => {
    const newItem = { id: uuidv4(), text: "" };
    onChange({ items: [...content.items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    onChange({ items: content.items.filter((item) => item.id !== id) });
  };

  const handleItemChange = (id: string, text: string) => {
    onChange({
      items: content.items.map((item) =>
        item.id === id ? { ...item, text } : item
      ),
    });
  };

  const textStyle = {
    fontSize: `${formatting?.fontSize || 16}px`,
    fontWeight: formatting?.bold ? "bold" : "normal",
    fontStyle: formatting?.italic ? "italic" : "normal", 
    textDecoration: formatting?.underline ? "underline" : "none",
    color: formatting?.color || "black",
    textAlign: formatting?.alignment || "left",
  } as React.CSSProperties;

  return (
    <div className="space-y-2">
      <ul className="space-y-2 list-disc pl-8">
        {content.items.map((item, index) => (
          <li key={item.id} className="relative group">
            <div className="flex items-center gap-2">
              <Input
                value={item.text}
                onChange={(e) => handleItemChange(item.id, e.target.value)}
                className="flex-1"
                placeholder={`Item ${index + 1}`}
                style={textStyle}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddItem}
          className="text-blue-500 flex items-center gap-1"
        >
          <PlusCircle size={16} />
          <span>Add Item</span>
        </Button>
      </div>
    </div>
  );
};