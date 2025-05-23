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
} from "@/components/shared";
import { Tag, ExternalLink } from "lucide-react";
import { TradeResponse } from "@/types/trades/dto";

interface TradeCardProps {
  trade: TradeResponse
}

export const TradeCard: React.FC<TradeCardProps> = ({ trade }) => {
  return (
    <Card className="overflow-hidden flex flex-col min-h-[320px] max-h-[320px]">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 pb-2 min-h-[96px]">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-2">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg truncate max-w-[160px]">{trade.name}</CardTitle>
          </div>
          <Badge variant="outline" className="font-normal">
            Trade
          </Badge>
        </div>
        <CardDescription className="mt-1 line-clamp-1 text-ellipsis overflow-hidden">{trade.description || "No description available"}</CardDescription>
      </CardHeader>
      <CardContent className="pt-3 space-y-3 flex-grow overflow-hidden">
        <div className="text-sm h-full">
          <div className="grid gap-2">
            <div>
              <span className="text-muted-foreground font-medium">Elements:</span>
              <div className="mt-0.5 bg-muted/30 p-1.5 rounded text-foreground overflow-hidden text-ellipsis">
                {trade.elements && trade.elements.length > 0 ? `${trade.elements.length} elements included` : "No elements"}
              </div>
            </div>
            
            <div>
              <span className="text-muted-foreground font-medium">Last Updated:</span>
              <div className="mt-0.5 bg-muted/30 p-1.5 rounded text-foreground overflow-hidden text-ellipsis">
                {new Date(trade.updated_at).toLocaleDateString()}
                {trade.updated_by && ` by ${trade.updated_by.email || "Unknown"}`}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/20 py-2 px-4">
        <div className="text-xs text-muted-foreground">
          ID: {trade.id.substring(0, 10)}
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 hover:bg-background/80">
          <ExternalLink className="h-3 w-3 mr-1" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
