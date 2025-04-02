import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { templates } from "@/data/templates";
import { Badge } from "@/components/shared/badge";
import { Separator } from "@/components/shared/separator";
import { TemplatePageProps } from "@/types/templates";

export default function TemplatePage({ params }: TemplatePageProps) {
  const template = templates.find((t) => t.id == params.id);

  if (!template) {
    notFound();
  }

  return (
    <div>
      <div className="relative w-full h-[240px] mb-8 overflow-hidden">
        <Image
          src={template.imageUrl}
          alt={template.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="space-y-8 pb-20">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {template.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-sm">
              <span>Created on {template.created_at}</span>
            </div>
            <Separator className="my-4" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <div className="prose prose-slate max-w-none">
              {template.description.split("\n").map((paragraph, idx) => (
                <p key={idx} className="text-base/relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Categories</h2>
            <p className="text-muted-foreground text-sm">
              Elements and components included in this template
            </p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse">
                <tbody>
                  {template.categories.map((category, idx) => (
                    <React.Fragment key={category.id}>
                      <tr
                        className={`border-b border-muted/40 ${
                          idx % 2 === 0 ? "bg-white" : "bg-muted/20"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            {category.name}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">
                            {category.elements?.length || 0} elements
                          </p>
                        </td>
                      </tr>

                      {category.elements && category.elements.length > 0 && (
                        <tr
                          className={`${
                            idx % 2 === 0 ? "bg-white" : "bg-muted/20"
                          }`}
                        >
                          <td colSpan={2} className="px-4 pb-4">
                            <div className="ml-6 border-l-2 pl-4 border-primary/20">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-muted/30">
                                    <th className="text-left py-2 px-2 text-sm font-medium">
                                      Element
                                    </th>
                                    <th className="text-left py-2 px-2 text-sm font-medium">
                                      Material Cost
                                    </th>
                                    <th className="text-left py-2 px-2 text-sm font-medium">
                                      Labor Cost
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {category.elements.map((element) => (
                                    <tr
                                      key={element.id}
                                      className="border-b border-muted/20"
                                    >
                                      <td className="py-2 px-2 text-sm">
                                        {element.name}
                                      </td>
                                      <td className="py-2 px-2 text-sm font-mono text-muted-foreground">
                                        {element.material_cost}
                                      </td>
                                      <td className="py-2 px-2 text-sm font-mono text-muted-foreground">
                                        {element.labor_cost}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Variables</h2>
            <p className="text-muted-foreground text-sm">
              Template dimensions and parameters
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {template.variables.map((variable, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
                >
                  <span className="font-medium">{variable.name}</span>
                  <span className="text-muted-foreground">{variable.type}</span>
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
