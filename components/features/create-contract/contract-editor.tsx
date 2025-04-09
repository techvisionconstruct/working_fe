"use client";

import { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ElementToolbar } from "./element-toolbar";
import { Canvas } from "./canvas";
import { PageSizeSelector } from "./page-size-selector";
import { PageSize, TextFormatting, Element, HeaderElement } from "./utils/types";
import { FormattingToolbar } from "./formatting-toolbar";
import { MarginControls, PageMargins } from "./margin-controls";

export const ContractEditor = () => {
  // Initialize with lowercase "a4" to match the PageSize type
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  
  // Store all elements
  const [elements, setElements] = useState<Element[]>([]);
  
  // Track which element is currently being edited
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  
  // Active element's formatting
  const [activeFormatting, setActiveFormatting] = useState<TextFormatting>({
    fontSize: 16,
  });

  // Add new state for page margins
  const [pageMargins, setPageMargins] = useState<PageMargins>({
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
  });

  // Get active element
  const activeElement = elements.find(el => el.id === activeElementId);

  // Memoize the page size handler to prevent recreating on each render
  const handlePageSizeChange = useCallback((size: PageSize) => {
    // Only update if the size is actually different
    if (size !== pageSize) {
      setPageSize(size);
    }
  }, [pageSize]);

  // Memoize the element focus handler
  const handleElementFocus = useCallback((id: string | null) => {
    setActiveElementId(id);
  }, []);

  // Memoize elements change handler
  const handleElementsChange = useCallback((newElements: Element[]) => {
    setElements(newElements);
  }, []);

  // Add a handler for margin changes
  const handleMarginsChange = useCallback((margins: PageMargins) => {
    setPageMargins(margins);
  }, []);

  // Update formatting when active element changes
  useEffect(() => {
    if (!activeElementId) {
      // Reset formatting when no element is selected
      setActiveFormatting({ fontSize: 16 });
      return;
    }

    // Find the active element
    const activeElement = elements.find(el => el.id === activeElementId);
    if (activeElement) {
      // Use the element's formatting if available, or default formatting
      setActiveFormatting(activeElement.formatting || { fontSize: 16 });
    }
  }, [activeElementId, elements]);

  // Update element formatting when toolbar changes
  const handleFormattingChange = useCallback((formatting: TextFormatting) => {
    if (!activeElementId) return;
    
    setActiveFormatting(formatting);
    
    // Update the element in the elements array
    setElements(prevElements => prevElements.map(el => 
      el.id === activeElementId 
        ? { ...el, formatting } 
        : el
    ));
  }, [activeElementId]);

  // Handle header level change for headers - with proper TypeScript
  const handleHeaderLevelChange = useCallback((level: number) => {
    if (!activeElementId || !activeElement || activeElement.type !== "header") return;
    
    // Validate that level is 1, 2, or 3 before updating
    if (level !== 1 && level !== 2 && level !== 3) {
      console.warn(`Invalid header level: ${level}. Must be 1, 2, or 3.`);
      return;
    }
    
    // First update the formatting based on level
    const newFormatting = {
      ...activeElement.formatting || {},
      fontSize: level === 1 ? 24 : level === 2 ? 20 : 18,
      bold: true
    };
    
    // Then update both level and formatting in a single state update
    setElements(prevElements => 
      prevElements.map(el => {
        if (el.id === activeElementId && el.type === "header") {
          return {
            ...el,
            content: {
              ...el.content,
              level: level as 1 | 2 | 3
            },
            formatting: newFormatting
          };
        }
        return el;
      })
    );
  }, [activeElementId, activeElement]);

  // Check if the active element can be formatted
  const canFormatActiveElement = activeElementId && 
    elements.find(el => el.id === activeElementId)?.type !== 'signature';

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-4">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-semibold">Contract Editor</h1>
            <PageSizeSelector 
              currentSize={pageSize} 
              onSizeChange={handlePageSizeChange} 
            />
          </div>
          
          {/* Add Margin Controls */}
          <MarginControls 
            margins={pageMargins}
            onMarginsChange={handleMarginsChange}
          />
          
          {/* Add formatting toolbar first */}
          <div className="mb-3 py-2 border-b border-gray-200">
            <FormattingToolbar 
              formatting={activeFormatting}
              onFormattingChange={handleFormattingChange}
              isDisabled={!canFormatActiveElement}
              activeElementType={activeElement?.type}
              onHeaderLevelChange={handleHeaderLevelChange}
              headerLevel={activeElement?.type === "header" ? activeElement.content.level : undefined}
            />
          </div>
          
          {/* Element toolbar moved to header */}
          <ElementToolbar />
        </div>
        
        <div className="flex flex-1">
          <div className="flex-1 bg-gray-100">
            <Canvas 
              pageSize={pageSize} 
              pageMargins={pageMargins} // Pass margins to Canvas
              elements={elements}
              onElementsChange={handleElementsChange}
              activeElementId={activeElementId}
              onElementFocus={handleElementFocus}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};