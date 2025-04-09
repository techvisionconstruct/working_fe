"use client";

import { useRef } from "react";
import { Element, PageSize } from "./utils/types";
import { getPageDimensions } from "./utils/page-sizes";
import { X, Printer, Download } from "lucide-react";
import { PageMargins } from "./margin-controls";

interface PrintPreviewProps {
  elements: Element[];
  pageSize: PageSize;
  pageMargins: PageMargins;
  onClose: () => void;
}

export const PrintPreview = ({ 
  elements, 
  pageSize, 
  pageMargins, 
  onClose 
}: PrintPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = getPageDimensions(pageSize);
  
  // Handle print action
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const pageStyle = `
      @page {
        size: ${pageSize === 'a4' ? 'A4' : pageSize === 'letter' ? 'letter' : pageSize === 'legal' ? 'legal' : 'A4'};
        margin: 0; /* Set margins to 0 since we're handling them in the layout */
      }
      body {
        margin: 0;
        padding: 0;
        background-color: white;
        font-family: Arial, sans-serif;
      }
      .page {
        width: ${width}px;
        height: ${height}px;
        position: relative;
        margin: 0 auto;
        background: white;
        box-sizing: border-box;
        overflow: hidden;
        padding: ${pageMargins.top}px ${pageMargins.right}px ${pageMargins.bottom}px ${pageMargins.left}px;
      }
      .contract-content {
        width: 100%;
        height: 100%;
        position: relative;
      }
      .element-wrapper {
        position: absolute;
        width: 100%;
      }
      /* Hide buttons and editing controls */
      button, .editing-controls, .resize-handle {
        display: none !important;
      }
      /* Clean formatting for contract elements */
      table {
        border-collapse: collapse;
        width: 100%;
      }
      table td, table th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      /* Typography refinements */
      h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
        margin-bottom: 0.5em;
      }
      p {
        margin-top: 0;
        margin-bottom: 1em;
      }
      ul, ol {
        margin-top: 0;
        margin-bottom: 1em;
      }
    `;
    
    // Create a clean representation of elements ordered by vertical position
    let printHtml = '';
    
    // Sort elements by Y position for proper document flow
    const sortedElements = [...elements]
      .filter(el => !el.isFloating) // Handle non-floating elements first
      .sort((a, b) => a.position.y - b.position.y);
    
    // Sort floating elements separately (to be positioned absolutely)
    const floatingElements = [...elements].filter(el => el.isFloating);
    
    // Get the preview HTML content
    if (containerRef.current) {
      printHtml = containerRef.current.innerHTML;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contract</title>
          <style>${pageStyle}</style>
        </head>
        <body>
          <div class="page">
            <div class="contract-content">
              ${printHtml}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for any resources to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
  
  // Download as PDF 
  const handleDownload = () => {
    // Just use the print functionality with 'Save as PDF' option
    handlePrint();
  };
  
  // Calculate relative position for elements to respect margins without showing them
  const getAdjustedPosition = (element: Element) => {
    if (element.isFloating) {
      // For floating elements, position them relative to the page margins
      return {
        left: element.position.x,
        top: element.position.y
      };
    } else {
      // For regular elements, position them within the content area
      return {
        left: 0, // Regular elements are full width
        top: element.position.y - pageMargins.top // Adjust for top margin
      };
    }
  };
  
  // Organize elements by their vertical position
  const sortedElements = [...elements]
    .filter(el => !el.isFloating)
    .sort((a, b) => a.position.y - b.position.y);
  
  const floatingElements = elements.filter(el => el.isFloating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh] max-w-[90vw]">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Contract Preview</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Preview container with paper appearance */}
        <div className="p-8 bg-gray-100">
          <div 
            ref={containerRef}
            className="relative mx-auto bg-white shadow-md overflow-hidden scale-75 origin-top" 
            style={{ 
              width: `${width}px`, 
              height: `${height}px`,
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {/* Content area that respects margins without showing them */}
            <div className="absolute" style={{
              top: `${pageMargins.top}px`,
              left: `${pageMargins.left}px`,
              width: `${width - (pageMargins.left + pageMargins.right)}px`,
              height: `${height - (pageMargins.top + pageMargins.bottom)}px`
            }}>
              {/* Render non-floating elements in document flow order */}
              {sortedElements.map(element => {
                const { top } = getAdjustedPosition(element);
                return (
                  <div
                    key={element.id}
                    className="element-wrapper"
                    style={{
                      position: 'absolute',
                      top: `${top}px`,
                      width: '100%'
                    }}
                  >
                    <ElementPreview 
                      element={element} 
                      contentWidth={width - (pageMargins.left + pageMargins.right)}
                    />
                  </div>
                );
              })}
              
              {/* Render floating elements */}
              {floatingElements.map(element => {
                const { left, top } = getAdjustedPosition(element);
                return (
                  <div
                    key={element.id}
                    style={{
                      position: 'absolute',
                      left: `${left}px`,
                      top: `${top}px`
                    }}
                  >
                    <ElementPreview 
                      element={element} 
                      contentWidth={width - (pageMargins.left + pageMargins.right)}
                      isFloating
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified element renderer specifically for print preview
interface ElementPreviewProps {
  element: Element;
  contentWidth: number;
  isFloating?: boolean;
}

const ElementPreview = ({ element, contentWidth, isFloating }: ElementPreviewProps) => {
  // Apply element formatting
  const getElementStyles = () => {
    const baseStyles: React.CSSProperties = {
      width: '100%' // Ensure elements take full width
    };
    
    if (element.formatting) {
      if (element.formatting.fontSize) {
        baseStyles.fontSize = `${element.formatting.fontSize}px`;
      }
      if (element.formatting.bold) {
        baseStyles.fontWeight = 'bold';
      }
      if (element.formatting.italic) {
        baseStyles.fontStyle = 'italic';
      }
      if (element.formatting.underline) {
        baseStyles.textDecoration = 'underline';
      }
      if (element.formatting.color) {
        baseStyles.color = element.formatting.color;
      }
      // Use either textAlign or alignment, whichever is defined
      if (element.formatting.textAlign) {
        baseStyles.textAlign = element.formatting.textAlign;
      } else if (element.formatting.alignment) {
        baseStyles.textAlign = element.formatting.alignment;
      }
    }
    
    return baseStyles;
  };
  
  const styles = getElementStyles();
  
  // Helper function to safely render HTML content
  const renderHTML = (htmlContent: string) => {
    return { __html: htmlContent };
  };
  
  // Render different element types
  switch (element.type) {
    case 'header': {
      // For headers, use appropriate heading level based on content.level
      const level = element.content.level || 1;
      // Define exact font sizes for each header level to match editor view exactly
      const headerStyles = {
        ...styles,
        lineHeight: '1.5', // Increased line height for better spacing
        fontWeight: 'bold',
        marginTop: level === 1 ? '12px' : level === 2 ? '10px' : '8px',
        marginBottom: level === 1 ? '12px' : level === 2 ? '10px' : '8px',
        fontSize: level === 1 ? '24px' : level === 2 ? '20px' : '18px',
        padding: '0', // Remove any default padding
        display: 'block', // Ensure block display
        width: '100%' // Full width
      };
      
      // Render the appropriate heading based on level with consistent styling
      return (
        <div style={headerStyles}>
          {element.content.text}
        </div>
      );
    }
    
    case 'text': {
      // For text elements, render HTML content safely with consistent styling
      const textStyles = {
        ...styles,
        margin: '0',
        padding: '0',
        lineHeight: '1.35', // Match the line height from the editor
        minHeight: '22px' // Match the min-height from the editor
      };
      
      // Check if content already has HTML tags
      const hasHtmlTags = /<[a-z][\s\S]*>/i.test(element.content.text);
      
      return (
        <div style={textStyles}>
          {hasHtmlTags ? (
            <div dangerouslySetInnerHTML={renderHTML(element.content.text)} />
          ) : (
            <div>{element.content.text}</div>
          )}
        </div>
      );
    }
    
    case 'bulletList':
      return (
        <div style={styles}>
          <ul>
            {element.content.items.map((item: any) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </div>
      );
    
    case 'numberList':
      return (
        <div style={styles}>
          <ol>
            {element.content.items.map((item: any) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ol>
        </div>
      );
    
    case 'table':
      return (
        <div style={styles}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {element.content.data.map((row: any[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    // Apply cell-specific formatting for complex cell data objects
                    const cellText = typeof cell === 'string' ? cell : cell.text;
                    const cellStyles: React.CSSProperties = { border: '1px solid #ddd', padding: '8px' };
                    
                    // If cell has its own formatting, apply it
                    if (typeof cell === 'object' && cell.formatting) {
                      if (cell.formatting.fontSize) {
                        cellStyles.fontSize = `${cell.formatting.fontSize}px`;
                      }
                      if (cell.formatting.bold) {
                        cellStyles.fontWeight = 'bold';
                      }
                      if (cell.formatting.italic) {
                        cellStyles.fontStyle = 'italic';
                      }
                      if (cell.formatting.underline) {
                        cellStyles.textDecoration = 'underline';
                      }
                      if (cell.formatting.color) {
                        cellStyles.color = cell.formatting.color;
                      }
                      // Apply text alignment
                      if (cell.formatting.textAlign) {
                        cellStyles.textAlign = cell.formatting.textAlign;
                      } else if (cell.formatting.alignment) {
                        cellStyles.textAlign = cell.formatting.alignment;
                      }
                    }
                    
                    return (
                      <td key={colIndex} style={cellStyles}>
                        {cellText}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    
    case 'signature':
      return (
        <div style={{ 
          ...styles,
          padding: '10px',
          width: '200px',
          textAlign: 'center'
        }}>
          <div>{element.content.label || 'Signature'}</div>
          {element.content.imageData ? (
            <img 
              src={element.content.imageData} 
              alt="Signature" 
              style={{ 
                maxWidth: '90%',
                maxHeight: '60px',
                margin: '10px auto',
                display: 'block'
              }}
            />
          ) : (
            <div style={{ height: '60px', borderBottom: '1px solid #ccc', marginTop: '10px' }}></div>
          )}
        </div>
      );
    
    default:
      return <div>Unsupported element type: {element.type}</div>;
  }
};