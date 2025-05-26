"use client";

import React from "react";
import { Separator } from "@/components/shared";

// Import the modular components
import { VariablesColumn } from "./components/variables-column";
import { TradesColumn } from "./components/trades-column";

import { VariableResponse } from "@/types/variables/dto";
import { TradeResponse } from "@/types/trades/dto";
import { TemplateResponse } from "@/types/templates/dto";

declare global {
  interface Window {
    openVariableDialog?: (variableName: string, callback: (newVar: any) => void) => void;
  }
}

interface TradesAndElementsStepProps {
  data: {
    trades: TradeResponse[];
    variables: VariableResponse[];
  };
  templateId: string | null;
  template: TemplateResponse | null;
  updateTrades: (trades: TradeResponse[]) => void;
  updateVariables?: (variables: VariableResponse[]) => void;
}

const TradesAndElementsStep: React.FC<TradesAndElementsStepProps> = ({
  data,
  templateId,
  template,
  updateTrades,
  updateVariables = () => { },
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Trades & Elements
            </h1>
            <p className="text-muted-foreground">
              Define the trades/services and variables that will be used to build your proposal template.
            </p>
          </div>
        </div>
        <Separator />
      </div>

      <div className="space-y-6">
        <VariablesColumn 
          variables={data.variables || []}
          updateVariables={updateVariables}
        />        <TradesColumn
          trades={data.trades || []}
          variables={data.variables || []}
          updateTrades={updateTrades}
          updateVariables={updateVariables}
        />
      </div>
    </div>
  );
};

export default TradesAndElementsStep;