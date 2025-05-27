"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, Label, Separator, Textarea } from "@/components/shared";
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TemplateDetailsProps {
  data: {
    name: string;
    description: string;
    image?: string;
  };
  updateData: (data: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const TemplateDetailsStep: React.FC<TemplateDetailsProps> = ({
  data,
  updateData,
  onValidationChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localImage, setLocalImage] = useState<string | undefined>(data.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation State
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name: boolean;
  }>({
    name: false,
  });

  // Validation Form
  useEffect(() => {
    validateForm();
  }, [data.name, touched]);

  const validateForm = () => {
    const newErrors: { name?: string } = {};

    if (!data.name.trim()) {
      newErrors.name = "Template name is required.";
    } else if (data.name.length > 100) {
      newErrors.name = "Template name must be less than 100 characters.";
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    if (onValidationChange) {
      onValidationChange(isValid);
    }

    return isValid;
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  useEffect(() => {
    setLocalImage(data.image);
  }, [data.image]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;

      // Store the base64 string in the state and parent component
      setLocalImage(base64String);
      updateData({
        ...data,
        image: base64String,
      });

      setIsUploading(false);
      console.log("Image processed as base64");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setLocalImage(undefined);
    updateData({
      ...data,
      image: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Template Details
            </h1>
            <p className="text-muted-foreground">
              Fill in the essential information to define your template.
            </p>
          </div>
        </div>
        <Separator />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Template Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Enter template name"
                value={data.name}
                onChange={(e) => updateData({ ...data, name: e.target.value })}
                onBlur={() => handleBlur("name")}
                className={
                  errors.name && touched.name ? "border-red-500 pr-10" : ""
                }
                aria-invalid={errors.name && touched.name ? "true" : "false"}
                aria-describedby={
                  errors.name && touched.name ? "name-error" : undefined
                }
              />
              {data.name && (
                <button
                  type="button"
                  onClick={() => updateData({ ...data, name: "" })}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                  tabIndex={-1}
                  aria-label="Clear template name"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
                </button>
              )}
              {errors.name && touched.name && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.name && touched.name && (
              <p id="name-error" className="text-sm text-red-500 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Description
              <span className="text-gray-500">&#40;Optional&#41;</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this template is for and how to use it"
              className="min-h-[220px]"
              value={data.description}
              onChange={(e) =>
                updateData({ ...data, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="image">
              Template Image{" "}
              <span className="text-gray-500">&#40;Optional&#41;</span>
            </Label>

            <div className="h-[294px] w-full relative">
              {!localImage ? (
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleFileSelect}
                  className={`absolute inset-0 border-2 border-dashed rounded-lg transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer
                    ${
                      isDragging
                        ? "border-primary/70 bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span className="text-sm font-medium">Processing...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <Upload className="w-10 h-10 mb-2 text-muted-foreground/70" />
                      <p className="text-sm font-medium mb-1">
                        {isDragging
                          ? "Drop to upload"
                          : "Drop image here or click to browse"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or GIF (max. 5MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    {/* Show the uploaded image as preview */}
                    <img
                      src={localImage}
                      alt="Template preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span className="text-xs font-medium text-white">
                            Image uploaded
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="h-7 px-3 bg-black/30 hover:bg-black/50 text-white border-0 rounded-md text-xs font-medium"
                            onClick={handleFileSelect}
                          >
                            Change
                          </button>
                          
                          <button
                            type="button"
                            className="h-7 px-3 bg-black/30 hover:bg-red-600/70 text-white border-0 rounded-md text-xs font-medium flex items-center"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image-update"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsStep;
