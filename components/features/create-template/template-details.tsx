"use client";

import { useState, useEffect } from "react";
import { Button, Input, Textarea, Card } from "@/components/shared";
import { Template, TemplateDetailsProps } from "@/types/templates";

export default function TemplateDetails({ template, onUpdateTemplate, onNext }: TemplateDetailsProps) {
  const [title, setTitle] = useState(template.title);
  const [description, setDescription] = useState(template.description);
  const [imageUrl, setImageUrl] = useState(template.image);
  const [previewUrl, setPreviewUrl] = useState(template.image || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sync with template prop changes (only on mount)
  useEffect(() => {
    setTitle(template.title);
    setDescription(template.description);
    setImageUrl(template.image);
    setPreviewUrl(template.image || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setImageUrl(file.name); 
    
    // Save to parent component
    onUpdateTemplate({
      ...template,
      image: file,
    });
    
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleSave = () => {
    
    onUpdateTemplate({
      ...template,
      title,
      description,
      image: imageUrl || selectedFile, 
    });
    onNext();
  };
  console.log('selectedFile:', selectedFile);
  console.log('template.image:', template.image);
  console.log('previewUrl:', previewUrl);
  console.log('imageUrl:', imageUrl);
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Template Details</h2>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label htmlFor="title" className="block mb-2 font-medium">
              Template Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setTitle(newTitle);
                
                // Save to parent component as you type
                onUpdateTemplate({
                  ...template,
                  title: newTitle,
                  description,
                  image: selectedFile,
                });
              }}
              placeholder="Enter template title"
              className="w-full"
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="templateImage" className="block mb-2 font-medium">
              Template Image
            </label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="w-full md:w-auto"
                >
                  Choose File
                </Button>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "No file selected"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              const newDescription = e.target.value;
              setDescription(newDescription);
              
              // Save to parent component as you type
              onUpdateTemplate({
                ...template,
                title,
                description: newDescription,
                image: selectedFile,
              });
            }}
            placeholder="Enter template description"
            className="min-h-[120px] w-full"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="min-w-[120px]">
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
