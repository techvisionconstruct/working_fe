"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, Button } from "@/components/shared";
import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "@/queryOptions/templates";
import { TemplateResponse } from "@/types/templates/dto";
import { GridCard } from "@/components/mockup/template-page/grid-card";
import { Header } from "@/components/mockup/template-page/header";
import { Filters } from "@/components/mockup/template-page/filters";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isPending } = useQuery(getTemplates(currentPage, pageSize, searchQuery));

  const templates = data?.data;
  const paginationMeta = data?.meta;
  const paginationLinks = data?.links;


  const myTemplates = templates?.filter(
    (template: TemplateResponse) => template.is_public === false
  );
  const globalTemplates = templates?.filter(
    (template: TemplateResponse) => template.is_public === true
  );
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.includes("/my-templates")) {
      setActiveTab("my-templates");
    } else if (pathname.includes("/global-templates")) {
      setActiveTab("global-templates");
    } else {
      setActiveTab("all");
    }
    setCurrentPage(1);
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      router.push(`/site/templates/all-templates`);
    } else if (value === "my-templates") {
      router.push(`/site/templates/my-templates`);
    } else if (value === "global-templates") {
      router.push(`/site/templates/global-templates`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!paginationMeta || newPage <= paginationMeta.total_pages)) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };

  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      <Header
        title="Proposal Templates"
        description="Browse, create, and manage templates for creating professional proposals."
      />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <Filters onSearch={handleSearch} />
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
          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(paginationMeta.current_page - 1) * paginationMeta.page_size + 1} to {' '}
                {Math.min(paginationMeta.current_page * paginationMeta.page_size, paginationMeta.total_count)} of{' '}
                {paginationMeta.total_count} templates
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {paginationMeta.current_page} of {paginationMeta.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(paginationMeta.total_pages)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="my-templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myTemplates && myTemplates.length > 0 ? (
              myTemplates.map((template: TemplateResponse) => (
                <GridCard key={template.id} template={template} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                {isPending ? "Loading templates..." : "No templates found"}
              </div>
            )}
          </div>
          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(paginationMeta.current_page - 1) * paginationMeta.page_size + 1} to {' '}
                {Math.min(paginationMeta.current_page * paginationMeta.page_size, paginationMeta.total_count)} of{' '}
                {paginationMeta.total_count} templates
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {paginationMeta.current_page} of {paginationMeta.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(paginationMeta.total_pages)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="global-templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates && templates.length > 0 ? (
              globalTemplates.map((template: TemplateResponse) => (
                <GridCard key={template.id} template={template} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                {isPending ? "Loading templates..." : "No templates found"}
              </div>
            )}
          </div>
          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(paginationMeta.current_page - 1) * paginationMeta.page_size + 1} to {' '}
                {Math.min(paginationMeta.current_page * paginationMeta.page_size, paginationMeta.total_count)} of{' '}
                {paginationMeta.total_count} templates
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {paginationMeta.current_page} of {paginationMeta.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(paginationMeta.total_pages)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
