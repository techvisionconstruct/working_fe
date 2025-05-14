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
      <div>
        <h2 className="text-2xl font-bold mb-4">Proposal Details</h2>
        <p className="text-muted-foreground mb-6">
          Provide the essential details for your proposal, including client information and project scope.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Proposal Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Proposal Information</h3>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Proposal Name</Label>
              <Input
                id="name"
                placeholder="Enter proposal name"
                value={data.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Proposal Description</Label>
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
          </div>
        </div>
        
        {/* Right Column - Client Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Client Information</h3>
          
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
