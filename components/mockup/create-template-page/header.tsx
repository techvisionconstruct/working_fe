import React from "react";
import { Separator, Button } from "@/components/shared";
import { PlusCircle, SaveAll } from "lucide-react";
import Link from "next/link";

interface TemplateHeaderProps {
  title: string;
  description: string;
}

export const Header: React.FC<TemplateHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="rounded-full">
            <SaveAll className="h-4 w-4" />
            Save as Draft
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};
