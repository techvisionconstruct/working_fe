"use client";

import React, { useState } from "react";
import { 
  Badge
} from "@/components/shared";
import Image from "next/image";
import { TemplateCreateRequest } from "@/types/templates/dto";
import { TradeResponse } from "@/types/trades/dto";
import { ElementResponse } from "@/types/elements/dto";
import { VariableResponse } from "@/types/variables/dto";
import { ImageIcon } from "lucide-react";

const replaceVariableIdsWithNames = (
  formula: string,
  variableList: VariableResponse[],
  formulaVars: Record<string, any>[]
): string => {
  if (!formula || !formulaVars || !variableList) return formula;

  let displayFormula = formula;

  formulaVars.forEach((variable) => {
    const variableName =
      variableList.find((v) => v.id === variable.id)?.name ||
      variable.name ||
      variable.id;

    const idPattern = new RegExp(`\\{${variable.id}\\}`, "g");
    displayFormula = displayFormula.replace(idPattern, `{${variableName}}`);
  });

  return displayFormula;
};

interface PreviewStepProps {
  data: TemplateCreateRequest;
  tradeObjects?: TradeResponse[];
  elementObjects?: ElementResponse[];
  variableObjects?: VariableResponse[];
}

const PreviewStep: React.FC<PreviewStepProps> = ({ 
  data, 
  tradeObjects = [], 
  variableObjects = [] 
}) => {
  console.log("PreviewStep data", data);
  
  // State to track which variable types are expanded
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});
  return (
    <div className="p-0 mx-auto">
      <div className="w-full max-w-8xl relative left-1/2 right-1/2 -translate-x-1/2 h-48 md:h-64 mb-4 rounded-2xl shadow overflow-hidden">
        {data.image ? (
          <Image 
            src={data.image}
            alt={data.name || "Template Preview"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
              <div className="text-xl font-medium text-center text-muted-foreground">No preview image</div>
            </div>
          </div>
        )}
      </div>
      
      <h2 className="text-4xl font-bold mb-2 tracking-tight leading-tight">
        {data.name || "Untitled Template"}
      </h2>
      <p className="text-lg text-muted-foreground mb-2">
        {data.description || "No description provided"}
      </p>

      {variableObjects.length > 0 && (
        <div className="mt-4 w-full">
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Variables
          </h3>
          {(() => {
            // Group variables by variable_type name
            const groupedVariables: Record<string, VariableResponse[]> = {};
            variableObjects.forEach((variable) => {
              const typeName = variable.variable_type?.name || 'Other';
              if (!groupedVariables[typeName]) {
                groupedVariables[typeName] = [];
              }
              groupedVariables[typeName].push(variable);
            });

            // Return the grouped variables UI in horizontal layout with limited display
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(groupedVariables).map(([typeName, variables]) => {
                  const isExpanded = expandedTypes[typeName] || false;
                  const visibleVariables = isExpanded ? variables : variables.slice(0, 3);
                  
                  return (
                    <div key={typeName}>
                      <h4 className="text-sm font-semibold mb-3 text-foreground">
                        {typeName}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {visibleVariables.map((variable) => (
                          <span
                            key={variable.id}
                            className="rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground border transition-colors hover:bg-muted"
                          >
                            {variable.name}
                          </span>
                        ))}
                        {variables.length > 3 && !isExpanded && (
                          <button
                            onClick={() => setExpandedTypes(prev => ({ ...prev, [typeName]: true }))}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20 transition-colors hover:bg-primary/20 cursor-pointer"
                          >
                            +{variables.length - 3} more
                          </button>
                        )}
                        {isExpanded && variables.length > 3 && (
                          <button
                            onClick={() => setExpandedTypes(prev => ({ ...prev, [typeName]: false }))}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20 transition-colors hover:bg-primary/20 cursor-pointer"
                          >
                            Show less
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {tradeObjects.length > 0 && (
        <div className="mt-8 w-full">
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Trades
          </h3>
          <div className="flex flex-col gap-4">
            {tradeObjects.map((trade) => (
              <div
                key={trade.id}
                className="rounded-lg border border-border bg-muted/40 px-4 py-3 hover:bg-accent/40 transition-colors"
              >
                <div className="mb-2">
                  <h4 className="font-medium text-base">{trade.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {trade.description || "No description"}
                  </p>
                </div>

                {trade.elements && trade.elements.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                      Elements
                    </div>
                    {trade.elements.map((element) => (
                      <div className="flex flex-col mt-1" key={element.id}>
                        <div className="p-4 rounded-lg border bg-background hover:shadow-sm transition-all">
                          {/* Element Details */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-sm">
                                {element.name}
                              </h5>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              {element.description}
                            </p>
                            <div className="grid grid-cols-2 gap-3 mt-1">
                              <div className="p-2 rounded-md bg-muted/40 border-l-2 border-primary/40">
                                <div className="text-xs font-medium text-muted-foreground">Material Formula</div>
                                <div className="text-sm mt-1 font-mono tracking-tighter leading-none">{element.material_cost_formula ? replaceVariableIdsWithNames(
                                  element.material_cost_formula,
                                  variableObjects,
                                  element.material_formula_variables || []
                                ) : ''}</div>
                              </div>
                              <div className="p-2 rounded-md bg-muted/40 border-l-2 border-primary/70">
                                <div className="text-xs font-medium text-muted-foreground">Labor Formula</div>
                                <div className="text-sm mt-1 font-mono tracking-tighter leading-none">{element.labor_cost_formula ? replaceVariableIdsWithNames(
                                  element.labor_cost_formula,
                                  variableObjects,
                                  element.labor_formula_variables || []
                                ) : ''}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewStep;
