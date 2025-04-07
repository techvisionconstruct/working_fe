"use client";

import { useState } from "react";
import { RichTextEditor } from "../utils/rich-text-editor";
import { TextFormatting } from "../utils/types";
import { Plus, Minus } from "lucide-react";
import { Button, Table, TableCell, TableRow, TableBody } from "@/components/shared";

interface TableElementProps {
  content: {
    rows: number;
    cols: number;
    data: string[][];
  };
  onChange: (content: any) => void;
  formatting?: TextFormatting;
  onFormattingChange?: (formatting: TextFormatting) => void;
}

export const TableElement = ({ 
  content, 
  onChange, 
  formatting = { fontSize: 14 },
  onFormattingChange 
}: TableElementProps) => {
  // Use local formatting only if global formatting is not provided
  const [localFormatting, setLocalFormatting] = useState<TextFormatting>({
    fontSize: 14,
  });

  // Determine which formatting to use (global or local)
  const activeFormatting = onFormattingChange ? formatting : localFormatting;
  const handleFormattingChange = onFormattingChange || setLocalFormatting;

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...content.data];
    newData[rowIndex][colIndex] = value;
    onChange({ ...content, data: newData });
  };

  const addRow = () => {
    const newRow = Array(content.cols).fill("");
    const newData = [...content.data, newRow];
    onChange({ ...content, rows: content.rows + 1, data: newData });
  };

  const removeRow = () => {
    if (content.rows <= 1) return;
    const newData = content.data.slice(0, -1);
    onChange({ ...content, rows: content.rows - 1, data: newData });
  };

  const addColumn = () => {
    const newData = content.data.map((row) => [...row, ""]);
    onChange({ ...content, cols: content.cols + 1, data: newData });
  };

  const removeColumn = () => {
    if (content.cols <= 1) return;
    const newData = content.data.map((row) => row.slice(0, -1));
    onChange({ ...content, cols: content.cols - 1, data: newData });
  };

  return (
    <div className="min-w-[400px]">
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={removeRow}
            className="p-1 h-8 w-8 text-gray-500 hover:text-red-500"
            disabled={content.rows <= 1}
          >
            <Minus size={14} />
          </Button>
          <span className="mx-1 text-sm">Rows: {content.rows}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={addRow}
            className="p-1 h-8 w-8 text-gray-500 hover:text-blue-500"
          >
            <Plus size={14} />
          </Button>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={removeColumn}
            className="p-1 h-8 w-8 text-gray-500 hover:text-red-500"
            disabled={content.cols <= 1}
          >
            <Minus size={14} />
          </Button>
          <span className="mx-1 text-sm">Columns: {content.cols}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={addColumn}
            className="p-1 h-8 w-8 text-gray-500 hover:text-blue-500"
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>
      
      <Table className="w-full border-collapse">
        <TableBody>
          {content.data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="border-b">
              {row.map((cell, colIndex) => (
                <TableCell 
                  key={colIndex} 
                  className="border p-0"
                >
                  <RichTextEditor
                    value={cell}
                    onChange={(value) => updateCell(rowIndex, colIndex, value)}
                    formatting={activeFormatting}
                    onFormattingChange={handleFormattingChange}
                    placeholder="Cell content"
                    multiline={false}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};