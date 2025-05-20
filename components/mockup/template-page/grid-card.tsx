import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shared";

import {
  FileText,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash,
  Tag,
  Clock,
} from "lucide-react";

import { format } from "date-fns";

import { TemplateResponse } from "@/types/templates/dto";
import Link from "next/link";

interface TemplateCardProps {
  template: TemplateResponse;
}

export const GridCard: React.FC<TemplateCardProps> = ({ template }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-ellipsis overflow-hidden">
              {template.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                template.status === "published" ? "default" : "secondary"
              }
              className="px-2 py-0.5 text-xs uppercase"
            >
              {template.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-2">
          {/* Trades as badges */}
          {template.trades && template.trades.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <FileText className="mr-1 h-3 w-3" />

                <div className="flex flex-wrap gap-1.5">
                  {template.trades.slice(0, 3).map((trade) => (
                    <Badge
                      key={trade.id}
                      variant="outline"
                      className="px-2 py-0 text-xs bg-slate-50 dark:bg-slate-800"
                    >
                      {trade.name}
                    </Badge>
                  ))}
                  {template.trades.length > 3 && (
                    <Badge
                      variant="outline"
                      className="px-2 py-0 text-xs bg-slate-50 dark:bg-slate-800"
                    >
                      +{template.trades.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {template.variables && template.variables.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Tag className="mr-1 h-3 w-3" />

                <div className="flex flex-wrap gap-1.5">
                  {template.variables.slice(0, 3).map((variable) => (
                    <Badge
                      key={variable.id}
                      variant="secondary"
                      className="px-2 py-0 text-xs"
                    >
                      {variable.name}
                    </Badge>
                  ))}
                  {template.variables.length > 3 && (
                    <Badge variant="secondary" className="px-2 py-0 text-xs">
                      +{template.variables.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>
                Updated at:{" "}
                {format(new Date(template.updated_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/site/templates/${template.id}`} className="w-1/2">
          <Button variant="outline" className="w-full rounded-full">
            View
          </Button>
        </Link>
        <Button variant="outline" className="w-1/2 rounded-full">
          Create Proposal
        </Button>
      </CardFooter>
    </Card>
  );
};
