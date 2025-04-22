"use client";

import { getTemplates } from "@/api/client/templates";
import { TemplateList } from "@/components/features/template-page/template-list-view";
import { TemplateGridView } from "@/components/features/template-page/template-grid-view";
import { Template } from "@/types/templates";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
} from "@/components/shared";
import { LayoutGrid, List, Search, Plus } from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  const templates = useQuery({
    queryKey: ["template"],
    queryFn: getTemplates,
  });
  
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("grid");

  const filteredTemplates = (templates.data || []).filter(
    (template: Template) => {
      const searchMatch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase());
      return searchMatch;
    }
  );

  if (templates.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (templates.isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error loading templates</div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Template Library</div>
        <Link
          href="/templates/create"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Create Template
          <Plus className="h-4 w-4" />
        </Link>
      </div>
      <div className="text-sm text-muted-foreground">
        Your personal library of ready-to-use templates — built once, used
        anytime. Streamline your workflow with ease.
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between my-4">
        <div className="relative flex-1 max-w-md w-full">
          <Input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          <span className="absolute left-2 top-2.5 text-muted-foreground pointer-events-none">
            <Search className="h-4 w-4 ml-1" />
          </span>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="grid">
              <LayoutGrid className="h-5 w-5" strokeWidth={1.5} />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-5 w-5" strokeWidth={1.5} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsContent value="grid">
          <TemplateGridView templates={filteredTemplates} />
        </TabsContent>
        <TabsContent value="list">
          <TemplateList templates={filteredTemplates} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
