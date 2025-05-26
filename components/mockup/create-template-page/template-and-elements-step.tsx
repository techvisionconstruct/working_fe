"use client";

import React, { useState } from "react";
import { Separator } from "@/components/shared";
import { VariableResponse } from "@/types/variables/dto";
import { TradeResponse } from "@/types/trades/dto";
import { VariablesColumn } from "./components/variables-column";
import { TradesColumn } from "./components/trades-column";

interface TradesAndElementsStepProps {
  data: {
    trades: TradeResponse[];
    variables: VariableResponse[];
  };
  updateTrades: (trades: TradeResponse[]) => void;
  updateVariables?: (variables: VariableResponse[]) => void;
}

const TradesAndElementsStep: React.FC<TradesAndElementsStepProps> = ({
  data,
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
              Fill in the essential information to define your trades and
              elements.
            </p>
          </div>
        </div>
        <Separator />
      </div>

      <div className="space-y-6">
        <VariablesColumn 
          variables={data.variables || []}
          updateVariables={updateVariables}
        />
        <TradesColumn 
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
