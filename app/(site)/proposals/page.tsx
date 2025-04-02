"use client";

import { useState } from "react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shared/tabs";
import { ScrollArea } from "@/components/shared/scroll-area";
import { SortByComponent } from "@/components/ui/proposals/sort-by";
import { Button } from "@/components/shared/button";
import SearchComponent from "@/components/ui/proposals/search";
import { SortOption } from "@/types/sort";
import ProposalGridView from "@/components/ui/proposals/proposal-grid-view";
import ProposalListView from "@/components/ui/proposals/proposal-list-view";

export default function ProposalPage() {
  const [sortOption, setSortOption] = useState<SortOption>({
    value: "date-descending",
    label: "Date (Newest First)",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p>Manage and track client proposals.</p>
        </div>
        <Button className="uppercase font-bold">New Proposal</Button>
      </div>
      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SearchComponent
              onChange={handleSearchChange}
              value={searchQuery}
            />
            <SortByComponent
              onChange={handleSortChange}
              initialValue={sortOption.value}
            />
          </div>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="grid" className="">
          <ScrollArea className="h-[calc(100vh-210px)]">
            <ProposalGridView sortOption={sortOption} searchQuery={searchQuery} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="list">
          <ScrollArea className="h-[calc(100vh-210px)]">
            <ProposalListView sortOption={sortOption} searchQuery={searchQuery} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
