"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shared/tabs";
import { Card, CardContent } from "@/components/shared/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/shared/table";
import { proposals } from "@/data/proposals";
import { Badge } from "@/components/shared/badge";
import { SortByComponent, SortOption } from "@/components/ui/proposals/sort-by";
import { Button } from "@/components/shared/button";
import SearchComponent from "@/components/ui/proposals/search";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function ProposalPage() {
  const [sortOption, setSortOption] = useState<SortOption>({
    value: "name-ascending",
    label: "Name (A-Z)",
  });

  const sortedProposals = useMemo(() => {
    return [...proposals].sort((a, b) => {
      if (sortOption.value === "name-ascending") {
        return a.title.localeCompare(b.title);
      } else if (sortOption.value === "name-descending") {
        return b.title.localeCompare(a.title);
      } else if (sortOption.value === "date-ascending") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortOption.value === "date-descending") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return 0;
    });
  }, [sortOption]);

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
            <SearchComponent />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedProposals.map((proposal) => (
              <Card
                key={proposal.id}
                className="h-full rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-full h-44 relative -mt-20">
                  <Image
                    src={proposal.imageUrl || "/placeholder.svg"}
                    alt={proposal.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent>
                  <h1 className="text-xl font-bold">{proposal.title}</h1>
                  <p className="mt-1 text-sm text-black/50 line-clamp-3">
                    {proposal.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex flex-wrap gap-2 max-w-full">
                      {proposal.categories.slice(0, 4).map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="font-bold uppercase text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                      {proposal.categories.length > 4 && (
                        <Badge
                          variant="outline"
                          className="font-bold uppercase text-xs"
                        >
                          +{proposal.categories.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <span className="uppercase font-bold">Variables</span>
                      <span className="ml-1 h-4 w-4 rounded-sm bg-black/50 text-xs text-primary-foreground flex items-center justify-center">
                        {proposal.variables?.length || 0}
                      </span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <span className="uppercase font-bold">Categories</span>
                      <span className="ml-1 h-4 w-4 rounded-sm bg-black/50 text-xs text-primary-foreground flex items-center justify-center">
                        {proposal.categories?.length || 0}
                      </span>
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center mt-4 ml-1">
                    <p className="text-sm font-bold">{proposal.created_at}</p>
                    <Link
                      href="#"
                      className="text-sm font-bold hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-1">
            {sortedProposals.map((proposal, index) => (
              <div
                key={proposal.id}
                className={`border rounded-md p-4 ${
                  index % 2 === 0 ? "bg-[#e8e8e8]" : "bg-white"
                }`}
              >
                <div className="font-bold text-xl">{proposal.title}</div>
                <div className="flex items-center justify-between mt-1 gap-x-8">
                  <div className="text-sm text-black/50 line-clamp-3">
                    {proposal.description}
                  </div>
                  <ExternalLink className="h-8 w-8 mr-8" />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex flex-wrap gap-2 max-w-full">
                      {proposal.categories.slice(0, 4).map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className={`font-bold uppercase text-xs ${
                            index % 2 === 0
                              ? "border border-black/30 text-black"
                              : "bg-none text-black"
                          }`}
                        >
                          {category}
                        </Badge>
                      ))}
                      {proposal.categories.length > 4 && (
                        <Badge
                          variant="outline"
                          className={`font-bold uppercase text-xs ${
                            index % 2 === 0
                              ? "border border-black/30 text-black"
                              : "bg-none text-black"
                          }`}
                        >
                          +{proposal.categories.length - 4} more
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 ${
                          index % 2 === 0
                            ? "border border-black/30 text-black"
                            : "bg-none text-black"
                        }`}
                      >
                        <span className="uppercase font-bold">Variables</span>
                        <span
                          className={`ml-1 h-4 w-4 rounded-sm text-xs flex items-center justify-center ${
                            index % 2 === 0
                              ? "bg-[#e6a310] text-black"
                              : "bg-black/50 text-primary-foreground"
                          }`}
                        >
                          {proposal.variables?.length || 0}
                        </span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 ${
                          index % 2 === 0
                            ? "border border-black/30 text-black"
                            : "bg-none text-black"
                        }`}
                      >
                        <span className="uppercase font-bold">Categories</span>
                        <span
                          className={`ml-1 h-4 w-4 rounded-sm text-xs flex items-center justify-center ${
                            index % 2 === 0
                              ? "bg-[#e6a310]"
                              : "bg-black/50 text-primary-foreground"
                          }`}
                        >
                          {proposal.categories?.length || 0}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
