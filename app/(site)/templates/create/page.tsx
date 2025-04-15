"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared";
import TemplateDetails from "@/components/features/create-template/template-details";
import TemplateVariables from "@/components/features/create-template/template-variables";
import TemplateCategories from "@/components/features/create-template/template-categories";
import TemplatePreview from "@/components/features/create-template/template-preview";
import { Template } from "@/types/templates";
import { postTemplate } from "@/hooks/api/templates/post-template";

const emptyTemplate: Template = {
  id: 0,
  name: "",
  description: "",
  modules: [],
  parameters: [],
  created_at: "",
  updated_at: "",
  template_elements: [],
  image: "",
};

export default function CreateTemplatePage() {
  const [currentTemplate, setCurrentTemplate] =
    useState<Template>(emptyTemplate);
  const [activeTab, setActiveTab] = useState("details");
  const [isSaved, setIsSaved] = useState(false);

  const updateTemplate = (
    updatedTemplate: Template | ((prevTemplate: Template) => Template)
  ) => {
    if (typeof updatedTemplate === "function") {
      setCurrentTemplate((prevState) => {
        const newState = updatedTemplate(prevState);
        return newState;
      });
    } else {
      setCurrentTemplate(updatedTemplate);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSaveTemplate = async () => {
    try {
      await postTemplate(currentTemplate);
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e5e7eb] flex flex-col py-4 px-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-4">Create New Template</h1>
          <p className="text-base text-gray-500 font-light max-w-2xl mx-auto mt-2">
            Build a professional, reusable template for future proposals.
          </p>
        </div>
        <div className="rounded-2xl shadow-md bg-white/90 backdrop-blur-md p-6 flex-1 flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full h-full flex flex-col"
          >
            <TabsList className="flex w-full mb-6 rounded-xl bg-gray-100 p-1 h-12">
              <TabsTrigger 
                value="details" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="parameters" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Variables
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Preview
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="details" className="h-full">
                <TemplateDetails
                  template={currentTemplate}
                  onUpdateTemplate={updateTemplate}
                  onNext={() => setActiveTab("parameters")}
                />
              </TabsContent>

              <TabsContent value="parameters" className="h-full">
                <TemplateVariables
                  parameter={currentTemplate.parameters}
                  onUpdateTemplate={updateTemplate}
                  onNext={() => setActiveTab("categories")}
                  onPrevious={() => setActiveTab("details")}
                />
              </TabsContent>

              <TabsContent value="categories" className="h-full">
                <TemplateCategories
                  template={currentTemplate}
                  onUpdateTemplate={updateTemplate}
                  onNext={() => setActiveTab("preview")}
                  onPrevious={() => setActiveTab("parameters")}
                />
              </TabsContent>

              <TabsContent value="preview" className="h-full">
                <TemplatePreview
                  template={currentTemplate}
                  onPrevious={() => setActiveTab("categories")}
                  onSave={handleSaveTemplate}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
