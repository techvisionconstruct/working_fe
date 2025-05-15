import { Button, Separator } from "@/components/shared";
import { PlusCircle } from "lucide-react";
import React from "react";

interface HeaderProps {
  title: string;
  description: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button className="rounded-full">
          <PlusCircle className="h-4 w-4" />
          New Contract
        </Button>
      </div>
    </div>
    <Separator />
  </div>
  );
};
