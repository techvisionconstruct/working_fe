"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  aspect?: "square" | "rectangle" | "auto";
  height?: number;
}

export function ImageUpload({
  value,
  onChange,
  className,
  disabled = false,
  placeholder = "Click or drag to upload an image",
  aspect = "auto",
  height = 200,
}: ImageUploadProps) {const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localImage, setLocalImage] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setLocalImage(value || "");
  }, [value]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    
    // Simulate progress for FileReader (since it doesn't provide real progress)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Small delay to show 100% progress
      setTimeout(() => {
        setLocalImage(base64String);
        onChange(base64String);
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      alert("Error reading file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };
  const handleRemoveImage = () => {
    setLocalImage("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAspectRatioClass = () => {
    switch (aspect) {
      case "square":
        return "aspect-square";
      case "rectangle":
        return "aspect-video";
      default:
        return "";
    }
  };
  return (
    <div className={cn("w-full", className)}>
      {/* Hidden file input for Change button */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors duration-200",
          getAspectRatioClass(),
          aspect === "auto" && `h-[${height}px]`,
          isDragging && !disabled
            ? "border-primary/70 bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer"
        )}
        style={aspect === "auto" ? { height: `${height}px` } : undefined}
      >        {!localImage ? (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleFileSelect}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >{isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <span className="text-sm font-medium">Processing...</span>
                <div className="w-32 bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground mt-1">{uploadProgress}%</span>
              </div>
            ) : (              <div className="flex flex-col items-center justify-center text-center px-4">
                <Upload className="w-10 h-10 mb-2 text-muted-foreground/70" />
                <p className="text-sm font-medium text-muted-foreground">
                  {placeholder}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full group">
            <Image
              src={localImage}
              alt="Uploaded image"
              fill
              className="object-cover rounded-lg"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileSelect();
                    }}
                    className="h-8 px-3"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="h-8 px-3"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
