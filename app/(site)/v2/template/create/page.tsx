"use client";

import React from "react";
import CreateTemplateForm from "@/components/features/v2/create-template-page/CreateTemplateForm";

export default function CreateTemplate() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Template</h1>
        <p className="text-muted-foreground mt-2">
          Create a new template to standardize your proposals and contracts
        </p>
      </div>
      
      <div className="mb-8">
        <CreateTemplateForm />
      </div>
    </div>
  );
}
