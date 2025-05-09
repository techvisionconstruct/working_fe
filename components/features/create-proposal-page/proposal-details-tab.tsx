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
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/shared/file-upload/file-upload";
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

const ProposalDetailsTab: React.FC<ProposalDetailsTabProps> = ({
  data,
  updateData,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    data.image || null
  );
  const [date, setDate] = useState<Date | undefined>(
    data.valid_until ? new Date(data.valid_until) : undefined
  );

  const handleChange = (field: string, value: string) => {
    updateData({
      ...data,
      [field]: value,
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function for ISO date format (yyyy-MM-dd)
  const formatISODate = (date: Date | undefined): string => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const requiredFields = [
    "name",
    "location",
    "client_name",
    "client_email",
    "client_phone",
    "client_address",
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.name.trim()) newErrors.name = "Proposal name is required.";
    if (!data.location.trim())
      newErrors.location = "Project location is required.";
    if (!data.client_name.trim())
      newErrors.client_name = "Client name is required.";

    // Email validation
    if (!data.client_email.trim()) {
      newErrors.client_email = "Client email is required.";
    } else {
      // Simple email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.client_email.trim())) {
        newErrors.client_email = "Please enter a valid email address.";
      }
    }

    // Phone validation
    if (!data.client_phone.trim()) {
      newErrors.client_phone = "Client phone is required.";
    } else if (!/^\d{10}$/.test(data.client_phone.trim())) {
      newErrors.client_phone =
        "Phone must be exactly 10 digits and contain only numbers.";
    }

    if (!data.client_address.trim())
      newErrors.client_address = "Client address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Proposal Details</h2>
        <p className="text-muted-foreground mb-6">
          Provide the essential details for your proposal, including client
          information and project scope.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Proposal Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Proposal Information</h3>

          <div className="grid gap-4">
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
                  onBlur={() => handleBlur("name")}
                  className={
                    errors.name && touched.name
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                  aria-invalid={errors.name && touched.name ? "true" : "false"}
                  aria-describedby={
                    errors.name && touched.name ? "name-error" : undefined
                  }
                />
                {data.name && (
                  <button
                    type="button"
                    onClick={() => handleChange("name", "")}
                    className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                    tabIndex={-1}
                    aria-label="Clear proposal name"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
              {errors.name && touched.name && (
                <p className="text-xs text-red-500" id="name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <Label htmlFor="description">
              Proposal Description{" "}
              <span className="text-gray-500">&#40;Optional&#41;</span>
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="Describe the project scope, goals, and any other relevant information"
                className="min-h-[120px] pr-10"
                value={data.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              {data.description && (
                <button
                  type="button"
                  onClick={() => handleChange("description", "")}
                  className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                  tabIndex={-1}
                  aria-label="Clear proposal description"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">
                Project Location <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="location"
                  placeholder="Enter project location"
                  value={data.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  onBlur={() => handleBlur("location")}
                  className={
                    errors.location && touched.location
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                  aria-invalid={
                    errors.location && touched.location ? "true" : "false"
                  }
                  aria-describedby={
                    errors.location && touched.location
                      ? "location-error"
                      : undefined
                  }
                />
                {data.location && (
                  <button
                    type="button"
                    onClick={() => handleChange("location", "")}
                    className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                    tabIndex={-1}
                    aria-label="Clear project location"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
              {errors.location && touched.location && (
                <p className="text-xs text-red-500" id="location-error">
                  {errors.location}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="valid_until">
                Valid Until <span className="text-red-500">*</span>
              </Label>
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
              <Label htmlFor="client_name">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="client_name"
                  placeholder="Enter client name"
                  value={data.client_name}
                  onChange={(e) => handleChange("client_name", e.target.value)}
                  onBlur={() => handleBlur("client_name")}
                  className={
                    errors.client_name && touched.client_name
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                  aria-invalid={
                    errors.client_name && touched.client_name ? "true" : "false"
                  }
                  aria-describedby={
                    errors.client_name && touched.client_name
                      ? "client_name-error"
                      : undefined
                  }
                />
                {data.client_name && (
                  <button
                    type="button"
                    onClick={() => handleChange("client_name", "")}
                    className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                    tabIndex={-1}
                    aria-label="Clear client name"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
              {errors.client_name && touched.client_name && (
                <p className="text-xs text-red-500" id="client_name-error">
                  {errors.client_name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client_email">
                Client Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="client_email"
                  type="email"
                  placeholder="Enter client email"
                  value={data.client_email}
                  onChange={(e) => handleChange("client_email", e.target.value)}
                  onBlur={() => handleBlur("client_email")}
                  className={
                    errors.client_email && touched.client_email
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                  aria-invalid={
                    errors.client_email && touched.client_email
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    errors.client_email && touched.client_email
                      ? "client_email-error"
                      : undefined
                  }
                />
                {data.client_email && (
                  <button
                    type="button"
                    onClick={() => handleChange("client_email", "")}
                    className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                    tabIndex={-1}
                    aria-label="Clear client email"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
              {errors.client_email && touched.client_email && (
                <p className="text-xs text-red-500" id="client_email-error">
                  {errors.client_email}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client_phone">
                Client Phone <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="client_phone"
                  placeholder="Enter client phone number"
                  value={data.client_phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange("client_phone", value);
                  }}
                  onBlur={() => handleBlur("client_phone")}
                  className={
                    errors.client_phone && touched.client_phone
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                  aria-invalid={
                    errors.client_phone && touched.client_phone
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    errors.client_phone && touched.client_phone
                      ? "client_phone-error"
                      : undefined
                  }
                />
                {data.client_phone && (
                  <button
                    type="button"
                    onClick={() => handleChange("client_phone", "")}
                    className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                    tabIndex={-1}
                    aria-label="Clear client phone"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
              {errors.client_phone && touched.client_phone && (
                <p className="text-xs text-red-500" id="client_phone-error">
                  {errors.client_phone}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client_address">
                Client Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="client_address"
                  placeholder="Enter client address"
                  className="min-h-[120px] pr-10"
                  value={data.client_address}
                  onChange={(e) =>
                    handleChange("client_address", e.target.value)
                  }
                  onBlur={() => handleBlur("client_address")}
                  aria-invalid={
                    errors.client_address && touched.client_address
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    errors.client_address && touched.client_address
                      ? "client_address-error"
                      : undefined
                  }
                />
                {data.client_address && (
                  <button
                    type="button"
                    onClick={() => handleChange("client_address", "")}
                    className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                    tabIndex={-1}
                    aria-label="Clear client address"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
              {errors.client_address && touched.client_address && (
                <p className="text-xs text-red-500" id="client_address-error">
                  {errors.client_address}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsTab;
