import { Button, Separator } from "@/components/shared";
import { Grid, List } from "lucide-react";
import React from "react";

interface HeaderProps {
  title: string;
  description: string;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export const Header: React.FC<HeaderProps> = ({ title, description, viewMode, setViewMode }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="w-9 p-0 rounded-full"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="w-9 p-0 rounded-full"
          >
            <List size={16} />
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};
