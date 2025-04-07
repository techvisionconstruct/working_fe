"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, PenTool } from "lucide-react";

interface SignatureContent {
  label: string;
  imageData?: string;
}

// Add isPrintPreview prop to SignatureElementProps
interface SignatureElementProps {
  content: SignatureContent;
  onChange: (content: SignatureContent) => void;
  isPrintPreview?: boolean; // Add this new prop
}

export const SignatureElement = ({ 
  content, 
  onChange,
  isPrintPreview = false // Default to false
}: SignatureElementProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load previously uploaded signature from localStorage
  useEffect(() => {
    const savedSignature = localStorage.getItem('savedSignature');
    if (savedSignature && !content.imageData) {
      onChange({
        ...content,
        imageData: savedSignature
      });
    } else if (content.imageData) {
      setUploadedImage(content.imageData);
    }
  }, []);
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // Handle dropping an image
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  // Process the uploaded image file
  const processFile = (file: File) => {
    if (!file.type.match('image.*')) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUploadedImage(imageData);
      
      // Save to localStorage and update content
      localStorage.setItem('savedSignature', imageData);
      onChange({
        ...content,
        imageData: imageData
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  // Clear the uploaded signature
  const clearSignature = () => {
    setUploadedImage(null);
    localStorage.removeItem('savedSignature');
    onChange({
      ...content,
      imageData: undefined
    });
  };
  
  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Edit the signature label
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      label: e.target.value
    });
  };
  
  // Fix the container and drop zone styling to properly contain everything
  return (
    <div 
      className="flex flex-col w-full" 
      style={{ 
        width: '350px',
        minHeight: isPrintPreview ? '70px' : '100px',
        maxHeight: isPrintPreview ? '70px' : '150px',
        overflow: 'hidden',
        position: 'relative' // Added to ensure proper containment
      }}
    >
      {/* Only show the label in edit mode, not in print preview */}
      {!isPrintPreview && (
        <div className="flex items-center mb-2 signature-label">
          <PenTool size={16} className="text-blue-500 mr-2" />
          <input 
            type="text"
            value={content.label || "Signature"}
            onChange={handleLabelChange}
            className="text-sm font-medium border-b border-transparent focus:border-blue-500 focus:outline-none"
            placeholder="Signature label"
          />
        </div>
      )}
      
      {!content.imageData && !isPrintPreview ? (
        <div 
          className={`border-2 border-dashed rounded-md transition-colors signature-element-container ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          style={{ 
            height: '70px',
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto', // Center the container
            padding: '2px', // Reduced padding to prevent overflow
            boxSizing: 'border-box', // Important: include borders in width calculation
            width: '70%' // Reduced from 90% to 70% for smaller width
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          
          <div className="flex items-center justify-center w-full">
            <Upload className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-sm text-gray-500 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                Drop signature image
              </p>
              <p className="text-xs text-gray-400 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                PNG with transparency
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Image display container - no changes needed here as it's working correctly */
        <div 
          className={isPrintPreview ? "" : "relative border border-gray-200 rounded-md group signature-element-container"}
          style={{ 
            height: '70px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isPrintPreview ? 0 : '8px',
            backgroundColor: isPrintPreview ? 'transparent' : 'white',
            overflow: 'hidden',
            boxSizing: 'border-box', // Include borders in dimensions
            width: '70%', // Reduced from 90% to 70% for smaller width
            margin: '0 auto' // Center the container
          }}
        >
          {content.imageData && (
            <img 
              src={content.imageData} 
              alt="Signature" 
              className="object-contain"
              style={{ 
                maxWidth: '90%',
                maxHeight: '60px',
                margin: '0 auto',
                display: 'block'
              }}
            />
          )}
          
          {!isPrintPreview && content.imageData && (
            <button
              onClick={clearSignature}
              className="absolute top-1 right-1 p-1 bg-red-50 text-red-500 rounded-bl shadow-sm border border-red-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
              aria-label="Remove signature"
              title="Remove signature"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};