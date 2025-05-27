"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrades } from "@/query-options/trades";
import { getElements } from "@/query-options/elements";
import { getVariables } from "@/query-options/variables";
import { TradeResponse } from "@/types/trades/dto";
import { ElementResponse } from "@/types/elements/dto";
import { VariableResponse } from "@/types/variables/dto";
import { Header } from "@/components/mockup/library-page/header";
import { Section } from "@/components/mockup/library-page/section";
import { TradeCard } from "@/components/mockup/library-page/trade-card";
import { ElementCard } from "@/components/mockup/library-page/element-card";
import { VariableCard } from "@/components/mockup/library-page/variable-card";
import {
  Input,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
} from "@/components/shared";
import { 
  Search, 
  Tag, 
  Puzzle, 
  Variable, 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Pagination state
  const [paginationState, setPaginationState] = useState({
    trades: { page: 1, pageSize: 6 },
    elements: { page: 1, pageSize: 6 },
    variables: { page: 1, pageSize: 6 }
  });

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.includes("/trades")) {
      setActiveTab("trades");
    } else if (pathname.includes("/elements")) {
      setActiveTab("elements");
    } else if (pathname.includes("/variables")) {
      setActiveTab("variables");
    } else {
      setActiveTab("all");
    }
    // Reset pagination to page 1 when changing tabs
    setPaginationState(prev => ({
      trades: { ...prev.trades, page: 1 },
      elements: { ...prev.elements, page: 1 },
      variables: { ...prev.variables, page: 1 }
    }));
  }, [pathname]);

  const [searchQueries, setSearchQueries] = useState({
    trades: "",
    elements: "",
    variables: "",
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      router.push(`/site/library`);
    } else if (value === "trades") {
      router.push(`/site/library/trades`);
    } else if (value === "elements") {
      router.push(`/site/library/elements`);
    } else if (value === "variables") {
      router.push(`/site/library/variables`);
    }
  };

  const { data: tradesData, isLoading: tradesLoading } = useQuery(
    getTrades(
      paginationState.trades.page, 
      paginationState.trades.pageSize, 
      searchQueries.trades
    )
  );
  const { data: elementsData, isLoading: elementsLoading } = useQuery(
    getElements(
      paginationState.elements.page,
      paginationState.elements.pageSize,
      searchQueries.elements
    )
  );
  const { data: variablesData, isLoading: variablesLoading } = useQuery(
    getVariables(
      paginationState.variables.page,
      paginationState.variables.pageSize,
      searchQueries.variables
    )
  );

  const trades = tradesData?.data;
  const elements = elementsData?.data;
  const variables = variablesData?.data;

  // Handle page changes for each section
  const handlePageChange = (section: 'trades' | 'elements' | 'variables', newPage: number, totalPages: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPaginationState(prev => ({
        ...prev,
        [section]: { ...prev[section], page: newPage }
      }));
    }
  };
  
  // Handle search query changes
  const handleSearchChange = (
    type: keyof typeof searchQueries,
    value: string
  ) => {
    setSearchQueries((prev) => ({
      ...prev,
      [type]: value,
    }));
    
    // Reset to page 1 when searching
    setPaginationState(prev => ({
      ...prev,
      [type]: { ...prev[type as keyof typeof prev], page: 1 }
    }));
  };

  return (
    <div className="flex-1 space-y-8 p-6 pt-0">
      <Header
        title="Component Library"
        description="Browse and manage all your trades, elements, and variables in one place."
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        defaultValue="all"
        className="space-y-6"
      >
        <TabsList className="justify-start">
          <TabsTrigger value="all">All Components</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-10">
          <Section
            title="Trades"
            description="Industry-specific categorizations for your elements and variables."
            icon={<Tag size={20} className="text-primary" />}
            action={
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search trades..."
                    className="pl-8 w-[200px] rounded-full"
                    value={searchQueries.trades}
                    onChange={(e) =>
                      handleSearchChange("trades", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="sm"
                  className="flex items-center gap-1 rounded-full"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Trade</span>
                </Button>
              </div>
            }
          >
            {tradesLoading ? (
              <div className="text-center py-8">Loading trades...</div>
            ) : trades?.length > 0 ? (
              <div className="space-y-4">
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-4`}
                >
                  {trades.map((trade: TradeResponse) => (
                    <TradeCard key={trade.id} trade={trade as any} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {tradesData?.meta && tradesData.meta.total_pages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(tradesData.meta.current_page - 1) * tradesData.meta.page_size + 1} to{' '}
                      {Math.min(tradesData.meta.current_page * tradesData.meta.page_size, tradesData.meta.total_count)} of{' '}
                      {tradesData.meta.total_count} trades
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('trades', 1, tradesData.meta.total_pages)}
                        disabled={tradesData.meta.current_page === 1 || tradesLoading}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline" 
                        size="icon"
                        onClick={() => handlePageChange('trades', tradesData.meta.current_page - 1, tradesData.meta.total_pages)}
                        disabled={tradesData.meta.current_page === 1 || tradesLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm font-medium">
                        Page {tradesData.meta.current_page} of {tradesData.meta.total_pages}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('trades', tradesData.meta.current_page + 1, tradesData.meta.total_pages)}
                        disabled={tradesData.meta.current_page === tradesData.meta.total_pages || tradesLoading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('trades', tradesData.meta.total_pages, tradesData.meta.total_pages)}
                        disabled={tradesData.meta.current_page === tradesData.meta.total_pages || tradesLoading}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Tag className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No trades match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </Section>
          <Section
            title="Elements"
            description="Reusable components for creating templates and proposals."
            icon={<Puzzle size={20} className="text-emerald-500" />}
            action={
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search elements..."
                    className="pl-8 w-[200px] rounded-full"
                    value={searchQueries.elements}
                    onChange={(e) =>
                      handleSearchChange("elements", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="sm"
                  className="flex items-center gap-1 rounded-full"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Element</span>
                </Button>
              </div>
            }
          >
            {elementsLoading ? (
              <div className="text-center py-8">Loading elements...</div>
            ) : elements?.length > 0 ? (
              <div className="space-y-4">
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-4`}
                >
                  {elements.map((element: ElementResponse) => (
                    <ElementCard key={element.id} element={element as any} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {elementsData?.meta && elementsData.meta.total_pages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(elementsData.meta.current_page - 1) * elementsData.meta.page_size + 1} to{' '}
                      {Math.min(elementsData.meta.current_page * elementsData.meta.page_size, elementsData.meta.total_count)} of{' '}
                      {elementsData.meta.total_count} elements
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('elements', 1, elementsData.meta.total_pages)}
                        disabled={elementsData.meta.current_page === 1 || elementsLoading}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline" 
                        size="icon"
                        onClick={() => handlePageChange('elements', elementsData.meta.current_page - 1, elementsData.meta.total_pages)}
                        disabled={elementsData.meta.current_page === 1 || elementsLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm font-medium">
                        Page {elementsData.meta.current_page} of {elementsData.meta.total_pages}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('elements', elementsData.meta.current_page + 1, elementsData.meta.total_pages)}
                        disabled={elementsData.meta.current_page === elementsData.meta.total_pages || elementsLoading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('elements', elementsData.meta.total_pages, elementsData.meta.total_pages)}
                        disabled={elementsData.meta.current_page === elementsData.meta.total_pages || elementsLoading}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Puzzle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No elements match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </Section>
          <Section
            title="Variables"
            description="Dynamic values that can be customized in your templates."
            icon={<Variable size={20} className="text-amber-500" />}
            action={
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search variables..."
                    className="pl-8 w-[200px] rounded-full"
                    value={searchQueries.variables}
                    onChange={(e) =>
                      handleSearchChange("variables", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="sm"
                  className="flex items-center gap-1 rounded-full"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Variable</span>
                </Button>
              </div>
            }
          >
            {variablesLoading ? (
              <div className="text-center py-8">Loading variables...</div>
            ) : variables?.length > 0 ? (
              <div className="space-y-4">
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-4`}
                >
                  {variables.map((variable: VariableResponse) => (
                    <VariableCard key={variable.id} variable={variable as any} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {variablesData?.meta && variablesData.meta.total_pages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(variablesData.meta.current_page - 1) * variablesData.meta.page_size + 1} to{' '}
                      {Math.min(variablesData.meta.current_page * variablesData.meta.page_size, variablesData.meta.total_count)} of{' '}
                      {variablesData.meta.total_count} variables
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('variables', 1, variablesData.meta.total_pages)}
                        disabled={variablesData.meta.current_page === 1 || variablesLoading}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline" 
                        size="icon"
                        onClick={() => handlePageChange('variables', variablesData.meta.current_page - 1, variablesData.meta.total_pages)}
                        disabled={variablesData.meta.current_page === 1 || variablesLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm font-medium">
                        Page {variablesData.meta.current_page} of {variablesData.meta.total_pages}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('variables', variablesData.meta.current_page + 1, variablesData.meta.total_pages)}
                        disabled={variablesData.meta.current_page === variablesData.meta.total_pages || variablesLoading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('variables', variablesData.meta.total_pages, variablesData.meta.total_pages)}
                        disabled={variablesData.meta.current_page === variablesData.meta.total_pages || variablesLoading}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Variable className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No variables match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <Section
            title="Trades"
            description="Industry-specific categorizations for your elements and variables."
            icon={<Tag size={20} className="text-primary" />}
            action={
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search trades..."
                    className="pl-8 w-[200px] rounded-full"
                    value={searchQueries.trades}
                    onChange={(e) =>
                      handleSearchChange("trades", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="sm"
                  className="flex items-center gap-1 rounded-full"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Trade</span>
                </Button>
              </div>
            }
          >
            {tradesLoading ? (
              <div className="text-center py-8">Loading trades...</div>
            ) : trades?.length > 0 ? (
              <div className="space-y-4">
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-4`}
                >
                  {trades.map((trade: TradeResponse) => (
                    <TradeCard key={trade.id} trade={trade as any} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {tradesData?.meta && tradesData.meta.total_pages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(tradesData.meta.current_page - 1) * tradesData.meta.page_size + 1} to{' '}
                      {Math.min(tradesData.meta.current_page * tradesData.meta.page_size, tradesData.meta.total_count)} of{' '}
                      {tradesData.meta.total_count} trades
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('trades', 1, tradesData.meta.total_pages)}
                        disabled={tradesData.meta.current_page === 1 || tradesLoading}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline" 
                        size="icon"
                        onClick={() => handlePageChange('trades', tradesData.meta.current_page - 1, tradesData.meta.total_pages)}
                        disabled={tradesData.meta.current_page === 1 || tradesLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm font-medium">
                        Page {tradesData.meta.current_page} of {tradesData.meta.total_pages}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('trades', tradesData.meta.current_page + 1, tradesData.meta.total_pages)}
                        disabled={tradesData.meta.current_page === tradesData.meta.total_pages || tradesLoading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('trades', tradesData.meta.total_pages, tradesData.meta.total_pages)}
                        disabled={tradesData.meta.current_page === tradesData.meta.total_pages || tradesLoading}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Tag className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No trades match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="elements" className="space-y-6">
          <Section
            title="Elements"
            description="Reusable components for creating templates and proposals."
            icon={<Puzzle size={20} className="text-emerald-500" />}
            action={
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search elements..."
                    className="pl-8 w-[200px] rounded-full"
                    value={searchQueries.elements}
                    onChange={(e) =>
                      handleSearchChange("elements", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="sm"
                  className="flex items-center gap-1 rounded-full"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Element</span>
                </Button>
              </div>
            }
          >
            {elementsLoading ? (
              <div className="text-center py-8">Loading elements...</div>
            ) : elements?.length > 0 ? (
              <div className="space-y-4">
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-4`}
                >
                  {elements.map((element: ElementResponse) => (
                    <ElementCard key={element.id} element={element as any} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {elementsData?.meta && elementsData.meta.total_pages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(elementsData.meta.current_page - 1) * elementsData.meta.page_size + 1} to{' '}
                      {Math.min(elementsData.meta.current_page * elementsData.meta.page_size, elementsData.meta.total_count)} of{' '}
                      {elementsData.meta.total_count} elements
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('elements', 1, elementsData.meta.total_pages)}
                        disabled={elementsData.meta.current_page === 1 || elementsLoading}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline" 
                        size="icon"
                        onClick={() => handlePageChange('elements', elementsData.meta.current_page - 1, elementsData.meta.total_pages)}
                        disabled={elementsData.meta.current_page === 1 || elementsLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm font-medium">
                        Page {elementsData.meta.current_page} of {elementsData.meta.total_pages}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('elements', elementsData.meta.current_page + 1, elementsData.meta.total_pages)}
                        disabled={elementsData.meta.current_page === elementsData.meta.total_pages || elementsLoading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('elements', elementsData.meta.total_pages, elementsData.meta.total_pages)}
                        disabled={elementsData.meta.current_page === elementsData.meta.total_pages || elementsLoading}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Puzzle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No elements match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <Section
            title="Variables"
            description="Dynamic values that can be customized in your templates."
            icon={<Variable size={20} className="text-amber-500" />}
            action={
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search variables..."
                    className="pl-8 w-[200px] rounded-full"
                    value={searchQueries.variables}
                    onChange={(e) =>
                      handleSearchChange("variables", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="sm"
                  className="flex items-center gap-1 rounded-full"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Variable</span>
                </Button>
              </div>
            }
          >
            {variablesLoading ? (
              <div className="text-center py-8">Loading variables...</div>
            ) : variables?.length > 0 ? (
              <div className="space-y-4">
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-4`}
                >
                  {variables.map((variable: VariableResponse) => (
                    <VariableCard key={variable.id} variable={variable as any} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {variablesData?.meta && variablesData.meta.total_pages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(variablesData.meta.current_page - 1) * variablesData.meta.page_size + 1} to{' '}
                      {Math.min(variablesData.meta.current_page * variablesData.meta.page_size, variablesData.meta.total_count)} of{' '}
                      {variablesData.meta.total_count} variables
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('variables', 1, variablesData.meta.total_pages)}
                        disabled={variablesData.meta.current_page === 1 || variablesLoading}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline" 
                        size="icon"
                        onClick={() => handlePageChange('variables', variablesData.meta.current_page - 1, variablesData.meta.total_pages)}
                        disabled={variablesData.meta.current_page === 1 || variablesLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm font-medium">
                        Page {variablesData.meta.current_page} of {variablesData.meta.total_pages}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('variables', variablesData.meta.current_page + 1, variablesData.meta.total_pages)}
                        disabled={variablesData.meta.current_page === variablesData.meta.total_pages || variablesLoading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange('variables', variablesData.meta.total_pages, variablesData.meta.total_pages)}
                        disabled={variablesData.meta.current_page === variablesData.meta.total_pages || variablesLoading}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Variable className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No variables match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
