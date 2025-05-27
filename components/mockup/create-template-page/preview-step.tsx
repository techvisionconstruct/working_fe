"use client";

import React, { useState } from "react";
import { 
  Badge,
  Button
} from "@/components/shared";
import Image from "next/image";
import { TemplateCreateRequest } from "@/types/templates/dto";
import { TradeResponse } from "@/types/trades/dto";
import { ElementResponse } from "@/types/elements/dto";
import { VariableResponse } from "@/types/variables/dto";
import { ImageIcon, ChevronRight, Variable, Package, BracesIcon, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  // State to track which variable types are expanded
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});
  
  // Initialize all trades as expanded by default
  const [expandedTrades, setExpandedTrades] = useState<Record<string, boolean>>(() => {
    const initialExpandedState: Record<string, boolean> = {};
    tradeObjects.forEach(trade => {
      initialExpandedState[trade.id] = true;
    });
    return initialExpandedState;
  });
  
  // Toggle function for expanding/collapsing trade sections
  const toggleTradeExpansion = (tradeId: string) => {
    setExpandedTrades(prev => ({
      ...prev,
      [tradeId]: !prev[tradeId]
    }));
  };
  
  return (
    <div className="p-0 mx-auto">
      {/* Banner Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full relative h-48 md:h-64 mb-6 rounded-xl shadow-md overflow-hidden"
      >
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
          >
            {data.name || "Untitled Template"}
          </motion.h2>
        </div>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-lg text-muted-foreground mb-6"
      >
        {data.description || "No description provided"}
      </motion.p>

      {/* Variables Section */}
      {variableObjects.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10"
        >
          <div className="pb-3 border-b mb-4">
            <div className="text-lg flex font-bold items-center">
              <Variable size={18} className="mr-1" />
              <span>Variables</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Group variables by variable_type */}
            {Object.entries(
              variableObjects.reduce((groups, variable) => {
                const typeName = variable.variable_type?.name || "Uncategorized";
                if (!groups[typeName]) {
                  groups[typeName] = [];
                }
                groups[typeName].push(variable);
                return groups;
              }, {} as Record<string, typeof variableObjects>)
            ).map(([typeName, typeVariables], typeIndex) => (
              <motion.div 
                key={typeName} 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + (typeIndex * 0.05) }}
              >
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {typeName} ({typeVariables.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {typeVariables.map((variable, varIndex) => (
                    <motion.div
                      key={variable.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 + (typeIndex * 0.03) + (varIndex * 0.01) }}
                      className="border rounded-md p-2 bg-muted/30 relative group hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-medium text-xs truncate pr-1">
                          {variable.name}
                        </div>
                      </div>
                      {variable.description && (
                        <div className="text-[10px] mt-1 line-clamp-1 text-muted-foreground">
                          {variable.description}
                        </div>
                      )}
                      {variable.value && (
                        <div className="text-[10px] mt-1 font-mono bg-muted/50 rounded px-1 py-0.5">
                          {variable.value}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trades Section */}
      {tradeObjects.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-10"
        >
          <div className="pb-3 border-b mb-4">
            <div className="text-lg flex font-bold items-center">
              <Package size={18} className="mr-1" />
              <span>Trades</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {tradeObjects.map((trade, tradeIndex) => {
              const isExpanded = expandedTrades[trade.id];
              const elementCount = trade.elements?.length || 0;
              
              return (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.1 + (tradeIndex * 0.05), ease: "easeOut" }}
                  className="border-l-4 border-l-primary/20 border border-border/20 bg-background hover:bg-muted/30 transition-all duration-200 overflow-hidden rounded-md"
                >
                  {/* Trade Header - Clickable */}
                  <div 
                    className="py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 relative group"
                    onClick={() => toggleTradeExpansion(trade.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex-shrink-0"
                          >
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{trade.name}</h4>
                              <Badge variant="outline" className="text-xs px-2 py-0.5 h-5 border-primary/20 text-primary/80">
                                {elementCount} element{elementCount !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            {trade.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {trade.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Elements Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          duration: 0.2, 
                          ease: "easeInOut",
                          opacity: { duration: 0.2 }
                        }}
                        className="border-t border-border bg-muted/20 overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          {/* Trade Image (when expanded) */}
                          {isExpanded && trade.image && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.05, duration: 0.2 }}
                              className="mb-4"
                            >
                              <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-md overflow-hidden border shadow-sm group hover:shadow-md">
                                <div className="w-full h-full overflow-hidden">
                                  <Image 
                                    src={trade.image || "/placeholder-image.jpg"} 
                                    alt={trade.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 40vw"
                                    className="object-cover transition-all duration-300 group-hover:scale-105" 
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                    priority={true}
                                  />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="text-sm font-medium text-white">{trade.name}</div>
                                  {trade.description && (
                                    <div className="text-xs text-white/80 mt-1 line-clamp-2">{trade.description}</div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                          
                          {/* Elements List */}
                          {trade.elements && trade.elements.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15, duration: 0.3 }}
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                                <AnimatePresence>
                                  {trade.elements.map((element, index) => (
                                    <motion.div
                                      key={element.id}
                                      initial={{ opacity: 0, y: 15, scale: 0.97 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -15, scale: 0.97 }}
                                      transition={{ 
                                        delay: index * 0.03, 
                                        duration: 0.25,
                                        ease: "easeOut"
                                      }}
                                      className="border rounded-md p-3 bg-background/80 hover:shadow-sm hover:bg-background transition-all"
                                    >
                                      {/* Element Image (if available) */}
                                      {element.image && (
                                        <div className="mb-3 relative w-full h-28 rounded-md overflow-hidden border shadow-sm">
                                          <Image 
                                            src={element.image}
                                            alt={element.name}
                                            fill
                                            className="object-cover"
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                          />
                                        </div>
                                      )}
                                      
                                      <div className="flex items-start gap-2">
                                        <div className="rounded-md bg-primary/10 p-2 flex-shrink-0">
                                          <BracesIcon className="h-3.5 w-3.5 text-primary/70" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-sm mb-1">{element.name}</div>
                                          {element.description && (
                                            <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                              {element.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      {/* Formulas with Better Visual Organization */}
                                      {(element.material_cost_formula || element.labor_cost_formula) && (
                                        <div className="space-y-2 mt-2">
                                          {/* Formula Header */}
                                          <div className="flex items-center">
                                            <div className="h-0.5 bg-primary/10 flex-grow mr-2"></div>
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Formulas</span>
                                            <div className="h-0.5 bg-primary/10 flex-grow ml-2"></div>
                                          </div>
                                          
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {/* Material Formula */}
                                            {element.material_cost_formula && (
                                              <div className="bg-muted/30 p-2 rounded-md border border-border/50 hover:border-primary/20 transition-colors">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                  <span className="text-xs font-medium text-primary/70 flex items-center">
                                                    <Package className="h-3 w-3 mr-0.5" />
                                                    Material
                                                  </span>
                                                </div>
                                                <code className="text-xs bg-muted/50 px-2 py-1 rounded text-wrap break-all block">
                                                  {replaceVariableIdsWithNames(
                                                    element.material_cost_formula,
                                                    variableObjects,
                                                    element.material_formula_variables || []
                                                  )}
                                                </code>
                                              </div>
                                            )}
                                            
                                            {/* Labor Formula */}
                                            {element.labor_cost_formula && (
                                              <div className="bg-muted/30 p-2 rounded-md border border-border/50 hover:border-primary/20 transition-colors">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                  <span className="text-xs font-medium text-primary/70 flex items-center">
                                                    <Users className="h-3 w-3 mr-0.5" />
                                                    Labor
                                                  </span>
                                                </div>
                                                <code className="text-xs bg-muted/50 px-2 py-1 rounded text-wrap break-all block">
                                                  {replaceVariableIdsWithNames(
                                                    element.labor_cost_formula,
                                                    variableObjects,
                                                    element.labor_formula_variables || []
                                                  )}
                                                </code>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          )}
                          
                          {/* Empty State - No Elements */}
                          {(!trade.elements || trade.elements.length === 0) && (
                            <div className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
                              <p className="text-sm">No elements</p>
                              <p className="text-xs mt-1">This trade doesn't have any elements</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
      
      {/* Empty State - No Content */}
      {variableObjects.length === 0 && tradeObjects.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-md my-8">
          <p className="text-lg">No content</p>
          <p className="text-sm mt-1">Add variables and trades to see them in the preview</p>
        </div>
      )}
    </div>
  );
};

export default PreviewStep;
