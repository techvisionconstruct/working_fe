"use client";

import React, { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge, Separator } from "@/components/shared";
import { TemplatePageProps } from "@/types/templates";
import { getTemplateById } from "@/hooks/api/templates/get-template-id";
import {
  getTemplateElements,
  TemplateElement,
} from "@/hooks/api/templates/get-template-elements";

export default function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    template,
    isLoading: isLoadingTemplate,
    error: templateError,
  } = getTemplateById(id);
  const {
    elements,
    isLoading: isLoadingElements,
    error: elementsError,
  } = getTemplateElements(id);

  const error = templateError || elementsError;
  const isLoading = isLoadingTemplate || isLoadingElements;

  if (error) {
    console.error("Error loading template:", error);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">Loading template...</div>
    );
  }

  if (!template) {
    notFound();
  }

  const elementsByModule = elements.reduce((acc, element) => {
    const module = element.module;
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(element);
    return acc;
  }, {} as Record<string, TemplateElement[]>);

  return (
    <div>
      <div className="relative w-full h-[240px] mb-8 overflow-hidden">
      <Image
        src={
          template.image ||
          "https://images.unsplash.com/photo-1593623671658-6b842c7f9697?q=80&w=1996&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={template.name}
        fill
        className="object-cover"
        priority
      />
      </div>

      <div className="container mx-auto px-4">
        <div className="space-y-8 pb-20">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {template.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-sm">
              <span>
                Created on {new Date(template.created_at).toLocaleDateString()}
              </span>
            </div>
            <Separator className="my-4" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <div className="prose prose-slate max-w-none">
            {template.description.split("\n").map((paragraph) => (
              <p key={paragraph.slice(0, 20)} className="text-base/relaxed">
                {paragraph}
              </p>
            ))}

            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Template Elements</h2>
            <p className="text-muted-foreground text-sm">
              Construction elements included in this template
            </p>

            {Object.entries(elementsByModule).map(
              ([moduleName, moduleElements]) => (
                <div key={moduleName} className="space-y-4">
                  <h3 className="text-lg font-bold text-center">{moduleName}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-muted/60 text-left">
                          <th className="py-3 px-4 text-sm font-medium">
                            Element
                          </th>

                          <th className="py-3 px-4 text-sm font-medium">
                            Material Formula
                          </th>
                          <th className="py-3 px-4 text-sm font-medium">
                            Labor Formula
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {moduleElements.map((element, idx) => (
                          <tr
                            key={element.id}
                            className={`border-b border-muted/40 ${
                              idx % 2 === 0 ? "bg-white" : "bg-muted/20"
                            }`}
                          >
                            <td className="py-3 px-4">
                              <span className="font-medium">
                                {element.name}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <code className="font-mono bg-muted/50 p-1 rounded text-sm">
                                {element.formula}
                              </code>
                            </td>
                            <td className="py-3 px-4">
                              <code className="font-mono bg-muted/50 p-1 rounded text-sm">
                                {element.labor_formula}
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Variables</h2>
            <p className="text-muted-foreground text-sm">
              Template dimensions and parameters
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {template.parameters.map((variable, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
                >
                  <span className="font-medium">{variable.name}</span>
                  <span className="text-muted-foreground">
                    {variable.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md font-medium">
                Create Proposal
              </button>
              <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-5 py-2 rounded-md font-medium">
                Edit Template
              </button>
              <button className="border hover:bg-muted px-5 py-2 rounded-md font-medium">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
