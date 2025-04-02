"use client";

import React, { useState } from "react";
import { Input } from "@/components/shared/input";
import { Search } from "lucide-react";
import { Button } from "@/components/shared/button";

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search proposals..."
          className="w-64 pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button className="uppercase font-bold">Search</Button>
    </div>
  );
}
