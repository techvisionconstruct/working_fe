"use client";

import { useRef, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { X, GripVertical } from "lucide-react";
import { Element, Position, TextFormatting } from "./utils/types";
import { HeaderElement } from "./elements/header-element";
import { TextElement } from "./elements/text-element";
import { BulletListElement } from "./elements/bullet-list-element";
import { NumberListElement } from "./elements/number-list-element";
import { TableElement } from "./elements/table-element";
import { SignatureElement } from "./elements/signature-element";

// Update the interface
interface ElementRendererProps {
  element: Element;
  canvasWidth: number;
  horizontalPadding: number;
  onDelete: (id: string) => void;
  onPositionChange: (position: Position) => void;
  onContentChange: (content: any) => void;
  onHeightChange: (height: number) => void;
  onFormattingChange?: (formatting: TextFormatting) => void;
  isActive?: boolean;
  onFocus?: () => void;
  topMargin?: number; // Add this prop
  isPrintPreview?: boolean; // Add this new prop
}

export const ElementRenderer = ({
  element,
  canvasWidth,
  horizontalPadding,
  topMargin = 0, // Default to 0
  onDelete,
  onPositionChange,
  onContentChange,
  onHeightChange,
  onFormattingChange,
  isActive = false,
  onFocus,
  isPrintPreview = false, // Default to false
}: ElementRendererProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [elementHeight, setElementHeight] = useState(0);

  // This is the critical part for drag and drop functionality
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: element.isFloating ? "MOVE_FLOATING_ELEMENT" : "MOVE_ELEMENT",
    item: () => {
      // Include all necessary data
      return {
        id: element.id,
        type: element.type,
        isFloating: element.isFloating,
        isMoving: true,
        // Store exact position to preserve during drag
        position: { ...element.position },
        content: element.content
      };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    // When drag ends without a valid drop
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        console.log("Drag ended without valid drop - element remains at original position");
      }
    }
  }), [element.id, element.position, element.content, element.type, element.isFloating]);

  // This separate handler is specifically for direct mouse dragging of floating elements
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!element.isFloating || !elementRef.current) return;

    // Prevent default to avoid text selection during drag
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const elementX = element.position.x;
    const elementY = element.position.y;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      // Update position through the callback, but maintain dimensions
      onPositionChange({
        x: elementX + dx,
        y: elementY + dy,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Connect drag functionality to appropriate elements
  useEffect(() => {
    if (element.isFloating && elementRef.current) {
      // For floating elements, make the entire element draggable
      dragRef(elementRef.current);
    }
  }, [dragRef, element.isFloating]);

  // Measure element height and report it to parent
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Use ResizeObserver to detect height changes
    const observer = new ResizeObserver(entries => {
      const height = entries[0].contentRect.height;
      setElementHeight(height);
      onHeightChange(height);
      
      // Dispatch custom event for the canvas to pick up
      const event = new CustomEvent('elementresized', { 
        bubbles: true,
        detail: { id: element.id, height }
      });
      elementRef.current?.dispatchEvent(event);
    });
    
    observer.observe(elementRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [element.id, onHeightChange]);

  // Add a new useEffect hook to reposition elements when they overlap
  useEffect(() => {
    // This effect will run when an element is moved or resized
    if (!element.isFloating && elementRef.current) {
      // Notify the canvas that an element has been moved or resized
      const event = new CustomEvent('elementmoved', { 
        bubbles: true,
        detail: { 
          id: element.id, 
          position: element.position,
          height: elementHeight
        }
      });
      elementRef.current.dispatchEvent(event);
    }
  }, [element.position, elementHeight, element.id, element.isFloating]);

  // Handle element click to set focus
  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click handler from firing
    if (onFocus) {
      onFocus();
    }
  };

  // Render the appropriate element type based on the type property
  const renderElement = () => {
    const contentWidth = canvasWidth - (horizontalPadding * 2);
    
    switch (element.type) {
      case "header":
        return (
          <HeaderElement 
            content={element.content} 
            onChange={onContentChange} 
            formatting={element.formatting}
            onFormattingChange={onFormattingChange}
            isPrintPreview={isPrintPreview}
          />
        );
      case "text":
        return (
          <TextElement 
            content={element.content} 
            onChange={onContentChange} 
            formatting={element.formatting}
            onFormattingChange={onFormattingChange}
            isPrintPreview={isPrintPreview}
          />
        );
      case "bulletList":
        return (
          <BulletListElement 
            content={element.content} 
            onChange={onContentChange}
            formatting={element.formatting}
            onFormattingChange={onFormattingChange}
            isPrintPreview={isPrintPreview}
          />
        );
      case "numberList":
        return (
          <NumberListElement 
            content={element.content} 
            onChange={onContentChange}
            formatting={element.formatting}
            onFormattingChange={onFormattingChange}
            isPrintPreview={isPrintPreview}
          />
        );
      case "table":
        return (
          <TableElement 
            content={element.content} 
            onChange={onContentChange}
            formatting={element.formatting}
            onFormattingChange={onFormattingChange}
            contentWidth={contentWidth}
            isPrintPreview={isPrintPreview}
          />
        );
      case "signature":
        return (
          <SignatureElement 
            content={element.content} 
            onChange={onContentChange}
            isPrintPreview={isPrintPreview}
          />
        );
      default:
        return <div>Unknown element type: {element.type}</div>;
    }
  };

  // Define element container class based on active state and type
  const containerClassName = isPrintPreview
    ? "relative" // Minimal styling for print preview
    : `relative group ${
        element.isFloating 
          ? "border-2 border-dashed border-blue-300 bg-blue-50 p-1 rounded" // Reduced padding from p-2 to p-1
          : isActive 
          ? "p-1 bg-blue-50 border border-blue-300 rounded" // Reduced padding from p-2 to p-1
          : "p-1 hover:bg-gray-50" // Reduced padding from p-2 to p-1
      }`;

  // Adjust the minimum Y position for non-floating elements
  const adjustPositionForMargins = (position: Position): Position => {
    if (!element.isFloating) {
      return {
        x: position.x,
        y: Math.max(position.y, topMargin) // Ensure Y is at least topMargin
      };
    }
    return position;
  };

  return (
    <div
      ref={elementRef}
      className={`absolute transition-opacity ${
        element.isFloating ? "cursor-move" : ""
      } ${isDragging ? "opacity-30" : "opacity-100"}`}
      style={{
        left: `${element.position.x}px`,
        top: `${Math.max(element.position.y, element.isFloating ? 0 : topMargin)}px`, // Apply topMargin to regular elements
        width: element.isFloating ? 
          element.type === "signature" ? "350px" : "auto" : // Increased from 200px to 350px
          `${canvasWidth - (horizontalPadding * 2)}px`,
        zIndex: isActive ? 5 : element.isFloating ? 10 : 1,
        transform: isDragging && !element.isFloating ? "translateY(-3px)" : "none",
        transition: "transform 0.2s, opacity 0.2s",
        height: element.type === "signature" && element.isFloating ? "80px" : 'auto', // Set fixed height for signature
      }}
      onMouseDown={element.isFloating ? handleMouseDown : undefined}
      onClick={handleElementClick}
    >
      <div className={containerClassName}>
        {/* Only show in edit mode, not in print preview */}
        {!isPrintPreview && !element.isFloating && (
          <div 
            ref={(node) => {
              dragHandleRef.current = node;
              if (node) {
                dragRef(node);
              }
            }}
            className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
          >
            <GripVertical size={18} className="text-gray-500 bg-white p-1 rounded-full shadow-sm" />
          </div>
        )}
        
        <div className={isPrintPreview ? "" : "relative pl-2"}> {/* Reduce padding since handle is outside */}
          {!isPrintPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering element click
                onDelete(element.id);
              }}
              className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-transparent text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <X size={16} />
            </button>
          )}
          {renderElement()}
        </div>
      </div>
    </div>
  );
};