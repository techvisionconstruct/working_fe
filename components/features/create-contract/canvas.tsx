"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import { Element, PageSize, Position, TextFormatting } from "./utils/types";
import { ElementRenderer } from "./element-renderer";
import { getPageDimensions } from "./utils/page-sizes";
import { PageMargins } from "./margin-controls";
import { Printer } from "lucide-react";
import { PrintPreview } from "./print-preview";

// Define DragItem interface to avoid 'any' types
interface DragItem {
  id?: string;
  type: string;
  isFloating?: boolean;
  isMoving?: boolean;
  position?: Position;
  content?: any;
  preview?: {
    icon?: React.ReactNode;
    label?: string;
  };
}

interface CanvasProps {
  pageSize: PageSize;
  pageMargins: PageMargins;
  elements?: Element[];
  onElementsChange?: (elements: Element[]) => void;
  activeElementId?: string | null;
  onElementFocus?: (elementId: string | null) => void;
}

export const Canvas = ({ 
  pageSize,
  pageMargins,
  elements: externalElements,
  onElementsChange,
  activeElementId,
  onElementFocus
}: CanvasProps) => {
  // Use local state if no external elements are provided
  const [localElements, setLocalElements] = useState<Element[]>([]);
  
  // Determine which elements state to use
  const elements = externalElements || localElements;
  const setElements = useCallback((newElementsOrFn: Element[] | ((prev: Element[]) => Element[])) => {
    // If external elements handler is provided, use it
    if (onElementsChange) {
      if (typeof newElementsOrFn === 'function') {
        const updatedElements = newElementsOrFn(externalElements || []);
        onElementsChange(updatedElements);
      } else {
        onElementsChange(newElementsOrFn);
      }
    } else {
      // Otherwise use local state
      setLocalElements(newElementsOrFn);
    }
  }, [externalElements, onElementsChange]);

  const [dropPreview, setDropPreview] = useState<{
    position: Position;
    type: string;
    isFloating?: boolean;
    icon?: React.ReactNode;
    label?: string;
  } | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const { width, height: pageHeight } = getPageDimensions(pageSize);
  const rowHeight = 50; // Height of each row for snapping
  const horizontalPadding = pageMargins.left; // Use marginLeft from pageMargins instead of fixed horizontal padding
  
  // Element height cache to store actual rendered heights
  const [elementHeights, setElementHeights] = useState<Record<string, number>>({});

  // Update elementHeights when elements change their size
  const updateElementHeight = useCallback((id: string, height: number) => {
    setElementHeights(prev => ({
      ...prev,
      [id]: height
    }));
  }, []);

  // Listen for element resize events
  useEffect(() => {
    const handleElementResize = (e: CustomEvent) => {
      if (e.detail && e.detail.id && e.detail.height) {
        updateElementHeight(e.detail.id, e.detail.height);
      }
    };
    
    // Cast to EventListener to handle custom event
    document.addEventListener('elementresized', handleElementResize as EventListener);
    
    return () => {
      document.removeEventListener('elementresized', handleElementResize as EventListener);
    };
  }, [updateElementHeight]);

  // Add to your existing useEffect hook or create a new one
  useEffect(() => {
    const handleElementMoved = (e: CustomEvent) => {
      const { id, position, height } = e.detail;
      
      // First find the moved element
      const movedElement = elements.find(el => el.id === id);
      if (!movedElement || movedElement.isFloating) return;
      
      // Find all elements that need to be moved down/up to avoid overlap
      const elementsToAdjust = elements.filter(el => 
        !el.isFloating && 
        el.id !== id && 
        el.position.y > position.y && 
        el.position.y < position.y + height
      );
      
      if (elementsToAdjust.length > 0) {
        // Create a new array of elements with adjusted positions
        const newElements = [...elements];
        
        // Loop through elements needing adjustment and move them below the moved element
        elementsToAdjust.forEach(el => {
          const index = newElements.findIndex(item => item.id === el.id);
          if (index !== -1) {
            newElements[index] = {
              ...el,
              position: {
                ...el.position,
                y: position.y + height + 10 // Add some margin
              }
            };
          }
        });
        
        // Update the elements array
        if (onElementsChange) {
          onElementsChange(newElements);
        } else {
          setLocalElements(newElements);
        }
      }
    };
    
    // Add event listener to canvas
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener('elementmoved', handleElementMoved as EventListener);
    }
    
    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('elementmoved', handleElementMoved as EventListener);
      }
    };
  }, [elements, onElementsChange, setLocalElements]);

  // Handle canvas click to clear focus
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only clear focus if clicking directly on the canvas, not on elements
    if (e.target === canvasRef.current && onElementFocus) {
      onElementFocus(null);
    }
  }, [onElementFocus]);

  // Handle element focus
  const handleElementFocus = useCallback((elementId: string) => {
    if (onElementFocus) {
      onElementFocus(elementId);
    }
  }, [onElementFocus]);

  const handleDeleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    
    // Also remove from height cache
    setElementHeights(prev => {
      const newHeights = {...prev};
      delete newHeights[id];
      return newHeights;
    });
    
    // Clear focus when deleting an element
    if (onElementFocus) {
      onElementFocus(null);
    }
  }, [onElementFocus, setElements]);

  // Get element height from cache or estimate
  const getElementHeight = useCallback((elementOrId: Element | string): number => {
    // If we received an id instead of an element
    if (typeof elementOrId === 'string') {
      const id = elementOrId;
      // If we have cached height, use it
      if (elementHeights[id]) {
        return elementHeights[id];
      }
      
      // Find the element by id
      const element = elements.find(el => el.id === id);
      if (!element) return rowHeight; // Default value if element not found
      
      elementOrId = element;
    }
    
    // Now we have the element object
    const element = elementOrId;
    
    // If we have cached height, use it
    if (elementHeights[element.id]) {
      return elementHeights[element.id];
    }
    
    // Otherwise, use estimates
    switch (element.type) {
      case 'header':
        return rowHeight;
      case 'text':
        // Estimate based on text length
        const textLength = element.content.text.length;
        const estimatedLines = Math.max(1, Math.ceil(textLength / 80));
        return estimatedLines * 24 + 20; // Add padding
      case 'bulletList':
      case 'numberList':
        return element.content.items.length * 30;
      case 'table':
        return element.content.rows * 40;
      case 'signature':
        return 80;
      default:
        return rowHeight;
    }
  }, [elementHeights, rowHeight, elements]);

  // Find the next available position to place a new element (avoiding overlaps)
  const findNextAvailablePosition = useCallback((type: string, isFloating?: boolean) => {
    if (isFloating) {
      // For floating elements, return a position in the center
      return {
        x: width / 2 - 75,
        y: Math.min(pageHeight / 2, 200)
      };
    }
    
    // For regular elements, find the next available row
    if (elements.length === 0) {
      return { x: horizontalPadding, y: pageMargins.top }; // Add top margin to the initial Y position
    }
    
    // Find the lowest y position (bottom of the canvas content)
    const regularElements = elements.filter(el => !el.isFloating);
    if (regularElements.length === 0) {
      return { x: horizontalPadding, y: pageMargins.top }; // Add top margin to the initial Y position
    }
    
    // Organize elements by vertical position
    const sortedElements = [...regularElements].sort((a, b) => 
      a.position.y - b.position.y
    );
    
    // Find the highest Y position + height
    let highestY = 0;
    for (const el of sortedElements) {
      const elHeight = getElementHeight(el);
      const elBottom = el.position.y + elHeight;
      highestY = Math.max(highestY, elBottom);
    }
    
    // Add some spacing
    const nextY = highestY + 10;
    
    // Snap to row grid
    const snappedY = Math.ceil(nextY / rowHeight) * rowHeight;
    
    // Check if we're beyond page bounds
    if (snappedY >= pageHeight - 100) {
      // If we're near the page bounds, find the first element that extends beyond the page
      // and position the new element at the same y as that element
      const lastVisibleElement = sortedElements.find(el => 
        el.position.y + getElementHeight(el) > pageHeight - 100
      );
      
      // If no such element, place at the top
      return { 
        x: horizontalPadding, 
        y: lastVisibleElement ? lastVisibleElement.position.y : pageMargins.top // Add top margin to the initial Y position
      };
    }
    
    return { x: horizontalPadding, y: snappedY };
  }, [elements, width, pageHeight, horizontalPadding, rowHeight, getElementHeight, pageMargins.top]);

  // Modify the reorderElements function to allow for more flexible positioning
  const reorderElements = useCallback((draggedId: string, newY: number) => {
    // First, separate the element being moved from the rest
    const draggedElement = elements.find(el => el.id === draggedId);
    if (!draggedElement || draggedElement.isFloating) return;
  
    // Separate floating and regular elements
    const floatingElements = elements.filter(el => el.isFloating);
    const regularElements = elements.filter(el => !el.isFloating && el.id !== draggedId);
    
    // Create a copy with the dragged element at the exact position user dropped it
    const updatedDraggedElement = {
      ...draggedElement,
      position: {
        ...draggedElement.position,
        x: horizontalPadding,
        y: newY  // Use the exact Y position where the user dropped it
      }
    };
    
    // Add the dragged element back to the array
    const newElements = [...regularElements, updatedDraggedElement];
    
    // Only adjust elements that would overlap
    const draggedHeight = getElementHeight(updatedDraggedElement);
    const elementsToAdjust = newElements.filter(el => 
      el.id !== draggedId && 
      !el.isFloating &&
      el.position.y > newY && 
      el.position.y < newY + draggedHeight
    );
    
    // If there are overlapping elements, adjust them
    if (elementsToAdjust.length > 0) {
      elementsToAdjust.forEach(el => {
        const idx = newElements.findIndex(e => e.id === el.id);
        if (idx !== -1) {
          newElements[idx] = {
            ...el,
            position: {
              ...el.position,
              y: newY + draggedHeight + 10 // Position below the dragged element
            }
          };
        }
      });
    }
    
    // Set the new state with updated elements plus floating elements
    setElements([...newElements, ...floatingElements]);
  }, [elements, horizontalPadding, getElementHeight, setElements]);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["ELEMENT", "FLOATING_ELEMENT", "MOVE_ELEMENT", "MOVE_FLOATING_ELEMENT"],
    
    hover: (item: DragItem, monitor) => {
      if (!canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) return;
      
      // Account for the canvas scaling (0.75) when calculating positions
      const scaleCompensation = 1 / 0.75; // Inverse of scale to compensate
      
      // Calculate position relative to the scaled canvas
      const position: Position = {
        x: (clientOffset.x - canvasRect.left) * scaleCompensation,
        y: (clientOffset.y - canvasRect.top) * scaleCompensation,
      };
      
      // For regular elements, snap to rows but keep exact cursor position for preview
      if (!item.isFloating) {
        position.x = horizontalPadding;
        // Store exact position for preview but we'll snap when actually dropping
      }
      
      // Make sure we don't update too frequently to avoid performance issues
      // Use debounced updates for smoother performance
      setDropPreview({
        position,
        type: item.type,
        isFloating: item.isFloating,
        icon: item.preview?.icon,
        label: item.preview?.label
      });
    },
    
    drop: (item: DragItem, monitor) => {
      setDropPreview(null); // Clear preview when dropped
      
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const dropOffset = monitor.getClientOffset();
      if (!dropOffset) return;

      // Compensate for the canvas scaling
      const scaleCompensation = 1 / 0.75;
      
      let position: Position = {
        x: (dropOffset.x - canvasRect.left) * scaleCompensation,
        y: (dropOffset.y - canvasRect.top) * scaleCompensation,
      };

      // Allow elements to be placed as far down as needed, but at least at top margin
      position.y = Math.max(pageMargins.top, position.y);

      // CASE 1: Moving an existing element (item.isMoving is true)
      if (item.isMoving && item.id) {
        console.log("Moving existing element:", item.id, "to position:", position);
        
        if (item.isFloating) {
          // For floating elements (signatures), keep them within the visible area
          updateElementPosition(item.id, {
            x: Math.max(0, Math.min(position.x, width - 350)),
            y: Math.max(pageMargins.top, position.y)
          });
        } else {
          // For regular elements, snap to row grid
          const snappedY = Math.floor(position.y / rowHeight) * rowHeight;
          // Allow positioning anywhere in the document
          reorderElements(item.id, snappedY);
        }
      } 
      // CASE 2: Adding a new element from the toolbar
      else {
        console.log("Adding new element of type:", item.type);
        
        if (!item.isFloating) {
          // For regular elements, use exact drop position but snap to grid
          position.y = Math.floor(position.y / rowHeight) * rowHeight;
          position.x = horizontalPadding;
        }
        createNewElement(item.type, position, item.isFloating);
      }
      
      return { id: item.id }; // Return a result to indicate successful drop
    },
    
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [elements, rowHeight, width, pageHeight, reorderElements, findNextAvailablePosition, horizontalPadding, pageMargins.top]);

  // Clear preview when not hovering
  useEffect(() => {
    if (!isOver) {
      setDropPreview(null);
    }
  }, [isOver]);

  const createNewElement = useCallback((type: string, position: Position, isFloating?: boolean) => {
    let newElement: Element;
    const id = uuidv4();

    // Default formatting based on element type
    const defaultFormatting: TextFormatting = 
      type === 'header' ? { fontSize: 24, bold: true } :
      type === 'text' ? { fontSize: 16 } :
      type === 'bulletList' ? { fontSize: 16 } :
      type === 'numberList' ? { fontSize: 16 } :
      type === 'table' ? { fontSize: 14 } :
      { fontSize: 16 };

    switch (type) {
      case "header":
        newElement = {
          id,
          type: "header",
          position,
          content: { text: "New Header", level: 1 },
          formatting: defaultFormatting
        };
        break;
      case "text":
        newElement = {
          id,
          type: "text",
          position,
          content: { text: "New text block" },
          formatting: defaultFormatting
        };
        break;
      case "bulletList":
        newElement = {
          id,
          type: "bulletList",
          position,
          content: { items: [{ id: uuidv4(), text: "Item 1" }] },
          formatting: defaultFormatting
        };
        break;
      case "numberList":
        newElement = {
          id,
          type: "numberList",
          position,
          content: { items: [{ id: uuidv4(), text: "Item 1" }] },
          formatting: defaultFormatting
        };
        break;
      case "table":
        newElement = {
          id,
          type: "table",
          position,
          content: { rows: 2, cols: 2, data: [["", ""], ["", ""]] },
          formatting: defaultFormatting
        };
        break;
      case "signature":
        newElement = {
          id,
          type: "signature",
          position,
          isFloating: true,
          content: { label: "Signature" }
          // No formatting for signature
        };
        break;
      case "columnLayout":
        newElement = {
          id,
          type: "columnLayout",
          position,
          content: { 
            columns: [
              { id: `col-${Date.now()}-1`, width: 50, elements: [] },
              { id: `col-${Date.now()}-2`, width: 50, elements: [] }
            ] 
          },
          formatting: defaultFormatting
        };
        break;
      default:
        return;
    }

    setElements(prev => [...prev, newElement]);
    
    // Focus the new element
    if (onElementFocus) {
      onElementFocus(id);
    }
  }, [onElementFocus, setElements]);

  // Update the updateElementPosition function to handle signatures specially

const updateElementPosition = useCallback((id: string, position: Position) => {
  setElements(prev =>
    prev.map(el => {
      if (el.id === id) {
        // For signature elements, only update position, don't allow resizing
        if (el.type === 'signature' && el.isFloating) {
          return { 
            ...el, 
            position, 
            // Ensure signature maintains fixed dimensions (no resize during move)
          };
        }
        return { ...el, position };
      }
      return el;
    })
  );
}, [setElements]);

  const updateElementContent = useCallback((id: string, content: any) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, content } : el))
    );
  }, [setElements]);

  // Update element formatting
  const updateElementFormatting = useCallback((id: string, formatting: TextFormatting) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, formatting } : el))
    );
  }, [setElements]);

  // Render the drop preview based on element type
  const renderDropPreview = () => {
    if (!dropPreview || !isOver || !canDrop) return null;
    
    const previewStyle = {
      position: 'absolute',
      left: `${dropPreview.position.x}px`,
      top: `${dropPreview.position.y}px`,
      zIndex: 1000,
      opacity: 0.8,
      pointerEvents: 'none',
      transition: 'all 0.1s ease',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties;
    
    // Different preview styling based on element type
    if (dropPreview.isFloating) {
      // Floating element preview (like signature)
      return (
        <div 
          style={previewStyle}
          className="border-2 border-dashed border-blue-500 bg-blue-50 p-4 rounded animate-pulse"
        >
          <div className="flex flex-col items-center">
            {dropPreview.icon && <div className="text-blue-500">{dropPreview.icon}</div>}
            <span className="text-sm font-medium">{dropPreview.label || 'Signature'}</span>
          </div>
        </div>
      );
    } else {
      // Regular element preview (full width)
      return (
        <div 
          style={{
            ...previewStyle,
            width: `${width - (horizontalPadding * 2)}px`,
            height: `${rowHeight}px`,
          }}
          className="border-2 border-dashed border-blue-500 bg-blue-50 rounded flex items-center px-3 animate-pulse"
        >
          {dropPreview.icon && <span className="mr-2 text-blue-500">{dropPreview.icon}</span>}
          <span className="font-medium">{dropPreview.label || dropPreview.type}</span>
        </div>
      );
    }
  };

  // Improve the handleDrop function
  const handleDrop = useCallback((item: DragItem, monitor: any) => {
    if (!monitor.didDrop() && canvasRef.current) {
      // Get the mouse position relative to the canvas
      const dropOffset = monitor.getClientOffset();
      if (!dropOffset) return;
      
      // Get canvas position
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      // Calculate the drop position within the canvas
      const dropPositionInCanvas = {
        x: dropOffset.x - canvasRect.left,
        y: dropOffset.y - canvasRect.top
      };
      
      // If this is an existing element being moved
      if (item.id && item.isMoving) {
        // Find the exact row where the drop happened
        const rowIndex = Math.floor(dropPositionInCanvas.y / rowHeight);
        const exactY = rowIndex * rowHeight;
        
        // Update element position
        const updatedElements = elements.map(el => 
          el.id === item.id 
            ? { 
                ...el, 
                position: { 
                  x: horizontalPadding, 
                  y: exactY
                } 
              }
            : el
        );
        
        // Reposition any overlapping elements
        const droppedElement = updatedElements.find(el => el.id === item.id);
        if (droppedElement && !droppedElement.isFloating) {
          const height = getElementHeight(droppedElement); // Now passing Element instead of string
          
          // Find elements that would overlap
          const overlappingElements = updatedElements.filter(el => 
            !el.isFloating &&
            el.id !== item.id &&
            el.position.y >= exactY &&
            el.position.y < exactY + height
          );
          
          // Reposition overlapping elements
          if (overlappingElements.length > 0) {
            overlappingElements.forEach(el => {
              const idx = updatedElements.findIndex(e => e.id === el.id);
              if (idx !== -1) {
                updatedElements[idx] = {
                  ...el,
                  position: {
                    ...el.position,
                    y: exactY + height + 10 // Add margin
                  }
                };
              }
            });
          }
        }
        
        if (onElementsChange) {
          onElementsChange(updatedElements);
        } else {
          setLocalElements(updatedElements);
        }
      }
      // For new elements being created, similar logic...
    }
  }, [elements, onElementsChange, setLocalElements, horizontalPadding, rowHeight, getElementHeight]);

  // Add or update the visualization for where an element will be dropped
  const renderDropIndicator = () => {
    if (isOver && canDrop && dropPreview) {
      const rowIndex = Math.floor(dropPreview.position.y / rowHeight);
      const indicatorY = rowIndex * rowHeight;
      
      return (
        <div 
          className="absolute left-0 right-0 bg-blue-100 border border-blue-300"
          style={{
            top: `${indicatorY}px`,
            height: `${rowHeight}px`,
            zIndex: 0,
            pointerEvents: 'none',
            transition: 'all 0.15s ease-out',
            boxShadow: 'inset 0 0 5px rgba(59, 130, 246, 0.3)'
          }}
        />
      );
    }
    return null;
  };

  // Add a state variable for showing the print preview
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  return (
    <div className="flex flex-col items-center pb-10">
      {/* Print preview button */}
      <div className="mb-4 self-end">
        <button
          onClick={() => setShowPrintPreview(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Printer size={16} />
          <span>Print Preview</span>
        </button>
      </div>
      
      <div 
        ref={(node) => {
          if (node) {
            canvasRef.current = node;
            drop(node);
          }
        }}
        className={`relative bg-white shadow-md mx-auto overflow-hidden`}
        style={{
          width: `${width}px`,
          height: `${pageHeight}px`,
          border: isOver && canDrop ? "2px dashed #4299e1" : "1px solid #e2e8f0",
          marginTop: "12px",
          transform: "scale(0.75)", // Scale down for better fit on screen
          transformOrigin: "top center", // Keep the top aligned when scaling
        }}
        onClick={handleCanvasClick}
      >
        {/* Page boundary indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-200 z-20"></div>
        
        {/* Row grid indicators */}
        {Array.from({ length: Math.floor(pageHeight / rowHeight) }).map((_, index) => (
          <div 
            key={index}
            className="absolute w-full h-px bg-gray-100"
            style={{ top: `${index * rowHeight}px` }}
          />
        ))}
        
        {/* Show margin guidelines */}
        <div 
          className="absolute border border-dashed border-gray-300 pointer-events-none"
          style={{
            top: `${pageMargins.top}px`,
            left: `${pageMargins.left}px`,
            right: `${pageMargins.right}px`,
            bottom: `${pageMargins.bottom}px`,
            width: `calc(100% - ${pageMargins.left + pageMargins.right}px)`,
            height: `calc(100% - ${pageMargins.top + pageMargins.bottom}px)`
          }}
        />
        
        {/* Render elements with updated focus handling */}
        {elements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            canvasWidth={width}
            horizontalPadding={horizontalPadding}
            topMargin={pageMargins.top}
            onDelete={handleDeleteElement}
            onPositionChange={(position) => updateElementPosition(element.id, position)}
            onContentChange={(content) => updateElementContent(element.id, content)}
            onHeightChange={(height) => updateElementHeight(element.id, height)}
            onFormattingChange={(formatting) => updateElementFormatting(element.id, formatting)}
            isActive={element.id === activeElementId}
            onFocus={() => handleElementFocus(element.id)}
          />
        ))}
        
        {/* Render drop preview */}
        {renderDropPreview()}

        {/* Display drop indicator */}
        {renderDropIndicator()}

      </div>
      
      {/* Show the print preview modal when enabled */}
      {showPrintPreview && (
        <PrintPreview
          elements={elements}
          pageSize={pageSize}
          pageMargins={pageMargins}
          onClose={() => setShowPrintPreview(false)}
        />
      )}
    </div>
  );
};