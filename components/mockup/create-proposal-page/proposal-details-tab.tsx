"use client";

import React, { useState } from "react";
import { 
  Input, 
  Label, 
  Textarea, 
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Separator,
} from "@/components/shared";
import { FileUpload, FileUploadDropzone, FileUploadList, FileUploadTrigger } from "@/components/shared/file-upload/file-upload";
import { Calendar } from "@/components/shared/calendar/calendar";
import { CalendarIcon, Upload, ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface ProposalDetailsTabProps {
  data: {
    name: string;
    description: string;
    image: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    client_address: string;
    valid_until: string;
    location: string;
  };
  updateData: (data: any) => void;
}

const ProposalDetailsTab: React.FC<ProposalDetailsTabProps> = ({ data, updateData }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(data.image || null);
  const [date, setDate] = useState<Date | undefined>(
    data.valid_until ? new Date(data.valid_until) : undefined
  );

  const handleChange = (field: string, value: string) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      handleChange("valid_until", newDate.toISOString());
    }
  };

  // Helper function to format dates without relying directly on date-fns
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Select a date";
    
    // Format as "Month Day, Year" (e.g., "May 15, 2023")
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function for ISO date format (yyyy-MM-dd)
  const formatISODate = (date: Date | undefined): string => {
    if (!date) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Proposal Details
            </h1>
            <p className="text-muted-foreground">
              Provide the essential details for your proposal, including client information and project scope.
            </p>
          </div>
        </div>
        <Separator />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Proposal Details */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Proposal Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Enter proposal name"
                value={data.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {data.name && (
                <button
                  type="button"
                  onClick={() => handleChange("name", "")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                  tabIndex={-1}
                  aria-label="Clear proposal name"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Description <span className="text-gray-500">&#40;Optional&#41;</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the project scope, goals, and any other relevant information"
              className="min-h-[120px]"
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Project Location</Label>
            <Input
              id="location"
              placeholder="Enter project location"
              value={data.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="valid_until">Valid Until</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="valid_until"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(date)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">
              Proposal Image <span className="text-gray-500">&#40;Optional&#41;</span>
            </Label>
            <div className="h-[180px] w-full relative">
              {!imagePreview ? (
                <div
                  className="absolute inset-0 border-2 border-dashed rounded-lg transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
                  onClick={() => document.getElementById('proposal-image-input')?.click()}
                >
                  <input
                    id="proposal-image-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64String = event.target?.result as string;
                          setImagePreview(base64String);
                          handleChange("image", base64String);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Upload className="w-10 h-10 mb-2 text-muted-foreground/70" />
                  <p className="text-sm font-medium mb-1">
                    Drop image here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Proposal preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-medium text-white">
                            Image uploaded
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="h-7 px-3 bg-black/30 hover:bg-black/50 text-white border-0 rounded-md text-xs font-medium"
                            onClick={() => document.getElementById('proposal-image-input')?.click()}
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            className="h-7 px-3 bg-black/30 hover:bg-red-600/70 text-white border-0 rounded-md text-xs font-medium flex items-center"
                            onClick={() => {
                              setImagePreview(null);
                              handleChange("image", "");
                            }}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    id="proposal-image-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64String = event.target?.result as string;
                          setImagePreview(base64String);
                          handleChange("image", base64String);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Client Details */}
        <div className="space-y-6">
         
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                placeholder="Enter client name"
                value={data.client_name}
                onChange={(e) => handleChange("client_name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_email">Client Email</Label>
              <Input
                id="client_email"
                type="email"
                placeholder="Enter client email"
                value={data.client_email}
                onChange={(e) => handleChange("client_email", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_phone">Client Phone</Label>
              <Input
                id="client_phone"
                placeholder="Enter client phone number"
                value={data.client_phone}
                onChange={(e) => handleChange("client_phone", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_address">Client Address</Label>
              <Textarea
                id="client_address"
                placeholder="Enter client address"
                className="min-h-[120px]"
                value={data.client_address}
                onChange={(e) => handleChange("client_address", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsTab;
