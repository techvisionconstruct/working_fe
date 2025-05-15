"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrades } from "@/queryOptions/trades";
import { getElements } from "@/queryOptions/elements";
import { getVariables } from "@/queryOptions/variables";
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
  Grid,
  List,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function LibraryPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    console.log(value);
  };

  // Fetch data using React Query
  const { data: tradesData, isLoading: tradesLoading } = useQuery(getTrades());
  const { data: elementsData, isLoading: elementsLoading } = useQuery(
    getElements()
  );
  const { data: variablesData, isLoading: variablesLoading } = useQuery(
    getVariables()
  );

  // Extract data arrays and handle potential undefined
  const trades = tradesData?.data || [];
  const elements = elementsData?.data || [];
  const variables = variablesData?.data || [];

  // Filter by search query
  const filteredTrades = trades.filter(
    (trade: TradeResponse) =>
      trade.origin === "original" 
      // trade.name.toLowerCase().includes(searchQueries.trades.toLowerCase())
  );

  const filteredElements = elements.filter(
    (element: ElementResponse) =>
      element.origin === "original" &&
      element.name.toLowerCase().includes(searchQueries.elements.toLowerCase())
  );

  const filteredVariables = variables.filter(
    (variable: VariableResponse) =>
      variable.origin === "original" &&
      variable.name
        .toLowerCase()
        .includes(searchQueries.variables.toLowerCase())
  );

  console.log(trades)

  // Handle search query changes
  const handleSearchChange = (
    type: keyof typeof searchQueries,
    value: string
  ) => {
    setSearchQueries((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <div className="flex-1 space-y-8 p-6 pt-0">
      {/* Page Header */}

      <Header
        title="Component Library"
        description="Browse and manage all your trades, elements, and variables in one place."
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Content */}
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

        {/* All Components Tab */}
        <TabsContent value="all" className="space-y-10">
          {/* Trades Section */}
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
            ) : filteredTrades.length > 0 ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-4`}
              >
                {filteredTrades.map((trade: TradeResponse) => (
                  <TradeCard key={trade.id} trade={trade as any} />
                ))}
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

          {/* Elements Section */}
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
            ) : filteredElements.length > 0 ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-4`}
              >
                {filteredElements.map((element: ElementResponse) => (
                  <ElementCard key={element.id} element={element as any} />
                ))}
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

          {/* Variables Section */}
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
            ) : filteredVariables.length > 0 ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-4`}
              >
                {filteredVariables.map((variable: VariableResponse) => (
                  <VariableCard key={variable.id} variable={variable as any} />
                ))}
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

        {/* Trades Tab */}
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
            ) : filteredTrades.length > 0 ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-4`}
              >
                {filteredTrades.map((trade: TradeResponse) => (
                  <TradeCard key={trade.id} trade={trade as any} />
                ))}
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

        {/* Elements Tab */}
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
            ) : filteredElements.length > 0 ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-4`}
              >
                {filteredElements.map((element: ElementResponse) => (
                  <ElementCard key={element.id} element={element as any} />
                ))}
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

        {/* Variables Tab */}
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
            ) : filteredVariables.length > 0 ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-4`}
              >
                {filteredVariables.map((variable: VariableResponse) => (
                  <VariableCard key={variable.id} variable={variable as any} />
                ))}
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
