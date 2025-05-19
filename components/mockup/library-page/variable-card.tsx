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
import { Variable, ExternalLink } from "lucide-react";
import { VariableResponse } from "@/types/variables/dto";

interface VariableCardProps {
  variable: VariableResponse;
}

export const VariableCard: React.FC<VariableCardProps> = ({ variable }) => {
  return (
    <Card className="overflow-hidden flex flex-col min-h-[320px] max-h-[320px]">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 pb-2 min-h-[96px]">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500/10 rounded-full p-2">
              <Variable className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-lg truncate max-w-[160px]">{variable.name}</CardTitle>
          </div>
          <Badge variant="outline" className="font-normal">
            Variable
          </Badge>
        </div>
        <CardDescription className="mt-1 line-clamp-1 text-ellipsis overflow-hidden">{variable.description || "No description available"}</CardDescription>
      </CardHeader>
      <CardContent className="pt-3 space-y-3 flex-grow overflow-hidden">
        <div className="text-sm h-full">
          <div className="grid gap-2">
            <div>
              <span className="text-muted-foreground font-medium">Type:</span>
              <div className="mt-0.5 bg-muted/30 p-1.5 rounded text-foreground capitalize">
                {variable.variable_type?.name || "Not specified"}
              </div>
            </div>
            
            <div>
              <span className="text-muted-foreground font-medium">Value:</span>
              <div className="mt-0.5 bg-muted/30 p-1.5 rounded text-foreground">
                {variable.value !== undefined ? variable.value : "Not set"}
                {variable.is_global && <span className="ml-2 text-xs text-muted-foreground">(Global)</span>}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/20 py-2 px-4">
        <div className="text-xs text-muted-foreground">
          ID: {variable.id.substring(0, 10)}
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 hover:bg-background/80">
          <ExternalLink className="h-3 w-3 mr-1" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
