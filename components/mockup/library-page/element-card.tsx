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
import { Puzzle, ExternalLink } from "lucide-react";
import { replaceVariableIdsWithNames } from "@/helpers/replace-variable-ids-with-names";

import { ElementResponse } from "@/types/elements/dto";
import { VariableResponse } from "@/types/variables/dto";

interface ElementCardProps {
  element: ElementResponse;
  variables?: VariableResponse[];
}

export const ElementCard: React.FC<ElementCardProps> = ({ element, variables = [] }) => {
  // Replace variable IDs with names in formulas
  const displayMaterialFormula = element.material_cost_formula && element.material_formula_variables ?
    replaceVariableIdsWithNames(element.material_cost_formula, variables, element.material_formula_variables) :
    element.material_cost_formula;
    
  const displayLaborFormula = element.labor_cost_formula && element.labor_formula_variables ?
    replaceVariableIdsWithNames(element.labor_cost_formula, variables, element.labor_formula_variables) :
    element.labor_cost_formula;

  return (
    <Card className="overflow-hidden flex flex-col min-h-[320px] max-h-[320px]">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 pb-2 min-h-[96px]">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/10 rounded-full p-2">
              <Puzzle className="h-4 w-4 text-emerald-500" />
            </div>
            <CardTitle className="text-lg truncate max-w-[160px]">{element.name}</CardTitle>
          </div>
          <Badge variant="outline" className="font-normal">
            Element
          </Badge>
        </div>
        <CardDescription className="mt-1 line-clamp-1 text-ellipsis overflow-hidden">{element.description || "No description available"}</CardDescription>
      </CardHeader>
      <CardContent className="pt-3 space-y-3 flex-grow overflow-hidden">
        <div className="text-sm h-full">
          <div className="grid gap-2">
            <div>
              <span className="text-muted-foreground font-medium">Material Cost:</span>
              <div className="mt-0.5 bg-muted/30 p-1.5 rounded text-foreground overflow-hidden text-ellipsis">
                {displayMaterialFormula || "Not specified"}
              </div>
            </div>
            
            <div>
              <span className="text-muted-foreground font-medium">Labor Cost:</span>
              <div className="mt-0.5 bg-muted/30 p-1.5 rounded text-foreground overflow-hidden text-ellipsis">
                {displayLaborFormula || "Not specified"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/20 py-2 px-4">
        <div className="text-xs text-muted-foreground">
          ID: {element.id.substring(0, 10)}
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 hover:bg-background/80">
          <ExternalLink className="h-3 w-3 mr-1" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
