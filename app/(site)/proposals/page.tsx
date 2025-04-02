"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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

  // Page animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren" 
      }
    }
  };

  return (
    <motion.div 
      className="container mx-auto py-8"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p>Manage and track client proposals.</p>
        </div>
        <Button className="uppercase font-bold">New Proposal</Button>
      </motion.div>
      <Tabs defaultValue="grid">
        <motion.div 
          className="flex justify-between items-center mb-4"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
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
        </motion.div>
        <TabsContent value="grid" className="">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ScrollArea className="h-[calc(100vh-210px)]">
              <ProposalGridView sortOption={sortOption} searchQuery={searchQuery} />
            </ScrollArea>
          </motion.div>
        </TabsContent>
        <TabsContent value="list">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ScrollArea className="h-[calc(100vh-210px)]">
              <ProposalListView sortOption={sortOption} searchQuery={searchQuery} />
            </ScrollArea>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}