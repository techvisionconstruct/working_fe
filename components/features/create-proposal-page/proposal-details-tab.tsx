import React from "react";
import {
  Input,
  Textarea,
  Button,
  Label
} from "@/components/shared";
import { FileImage } from "lucide-react";
import { ProposalFormData } from "./types";

interface ProposalDetailsTabProps {
  value: {
    name: string;
    description: string;
    client_name: string;
    client_email: string;
    phone_number: string;
    address: string;
    image: string;
  };
  onChange: (value: any) => void;
  onNext: () => void;
  errors?: Record<string, string>;
}

export function ProposalDetailsTab({ 
  value, 
  onChange, 
  onNext,
  errors = {} 
}: ProposalDetailsTabProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: inputValue } = e.target;
    onChange({
      ...value,
      [name]: inputValue,
    });
  };
  
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    onChange({
      ...value,
      phone_number: numericValue,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Proposal Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter proposal name"
              value={value.name}
              onChange={handleInputChange}
              className={`mt-1 ${errors["name"] ? "border-red-500" : ""}`}
            />
            {errors["name"] && (
              <p className="text-sm text-red-500 mt-1">{errors["name"]}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe this proposal"
              value={value.description}
              onChange={handleInputChange}
              className={`mt-1 min-h-32 ${errors["description"] ? "border-red-500" : ""}`}
            />
            {errors["description"] && (
              <p className="text-sm text-red-500 mt-1">{errors["description"]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image">Proposal Image URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="image"
                name="image"
                placeholder="Image URL"
                value={value.image}
                onChange={handleInputChange}
                className={errors["image"] ? "border-red-500" : ""}
              />
              <Button variant="outline" className="flex-shrink-0">
                <FileImage className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            {errors["image"] && (
              <p className="text-sm text-red-500 mt-1">{errors["image"]}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="client_name">Client Name</Label>
            <Input
              id="client_name"
              name="client_name"
              placeholder="Client's full name"
              value={value.client_name}
              onChange={handleInputChange}
              className={`mt-1 ${errors["client_name"] ? "border-red-500" : ""}`}
            />
            {errors["client_name"] && (
              <p className="text-sm text-red-500 mt-1">{errors["client_name"]}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="client_email">Client Email</Label>
            <Input
              id="client_email"
              name="client_email"
              type="email"
              placeholder="client@example.com"
              value={value.client_email}
              onChange={handleInputChange}
              className={`mt-1 ${errors["client_email"] ? "border-red-500" : ""}`}
            />
            {errors["client_email"] && (
              <p className="text-sm text-red-500 mt-1">{errors["client_email"]}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone_number">Client Phone</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Phone number"
              value={value.phone_number}
              onChange={handlePhoneInput}
              className={`mt-1 ${errors["phone_number"] ? "border-red-500" : ""}`}
            />
            {errors["phone_number"] && (
              <p className="text-sm text-red-500 mt-1">{errors["phone_number"]}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="address">Client Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Client's address"
              value={value.address}
              onChange={handleInputChange}
              className={`mt-1 ${errors["address"] ? "border-red-500" : ""}`}
            />
            {errors["address"] && (
              <p className="text-sm text-red-500 mt-1">{errors["address"]}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Preview</h3>
        </div>
        <div className="mt-2 p-4 border rounded-lg">
          <div className="flex gap-4 items-start">
            <div className="w-20 h-20 relative overflow-hidden rounded-md flex-shrink-0">
              {value.image && (
                <img
                  src={value.image}
                  alt="Proposal"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {value.name || "Untitled Proposal"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {value.description || "No description provided."}
              </p>
              <div className="mt-2">
                <span className="text-xs font-medium">Client: </span>
                <span className="text-xs text-muted-foreground">
                  {value.client_name || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onNext}>
          Continue to Template Selection
        </Button>
      </div>
    </div>
  );
}
