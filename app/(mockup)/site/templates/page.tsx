"use client";

import React from "react";
import { Tabs, TabsContent } from "@/components/shared";
import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "@/queryOptions/templates";
import { TemplateResponse } from "@/types/templates/dto";
import { GridCard } from "@/components/mockup/template-page/grid-card";
import { Header } from "@/components/mockup/template-page/header";
import { Filters } from "@/components/mockup/template-page/filters";

export default function TemplatesPage() {
  const { data, isError, isPending } = useQuery(getTemplates());
  const templates = data?.data?.filter((template: TemplateResponse) => template.origin === 'original');

  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      <Header
        title="Proposal Templates"
        description="Browse, create, and manage templates for creating professional proposals."
      />
      <Tabs defaultValue="all" className="space-y-4">
        <Filters />
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates && templates.length > 0 ? (
              templates.map((template: TemplateResponse) => (
                <GridCard key={template.id} template={template} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                {isPending ? "Loading templates..." : "No templates found"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
