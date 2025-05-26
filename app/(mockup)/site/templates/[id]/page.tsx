"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TemplateDetailedLoader } from "@/components/features/template-page/loader-detailed";
import { VariableResponse } from "@/types/variables/dto";
import { TradeResponse } from "@/types/trades/dto";
import { ElementResponse } from "@/types/elements/dto";
import { getTemplate } from "@/query-options/templates";
import { AlertError } from "@/components/features/alert-error/alert-error";
import { replaceVariableIdsWithNames } from "@/helpers/replace-variable-ids-with-names";
import Link from "next/link";
import { Package, Users, BracesIcon, Variable, ChevronRight } from "lucide-react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

export default function TemplatedById() {
  const { id } = useParams();
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

  const {
    data: template,
    isLoading,
    isError,
  } = useQuery(getTemplate(String(id)));

  if (isLoading) {
    return <TemplateDetailedLoader />;
  }

  if (isError) {
    return <AlertError resource="template" />;
  }

  return (
    <div className="p-0 mx-auto">
      <div className="w-full max-w-8xl relative left-1/2 right-1/2 -translate-x-1/2 h-48 md:h-64 mb-4">
        <Link
          href="/site/templates"
          className="absolute left-4 top-4 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm hover:bg-background transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:translate-x-[-2px] transition-transform">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span className="text-sm font-medium">Back to templates</span>
        </Link>
        <Image
          src={template.image || DEFAULT_IMAGE}
          alt={template?.name || "Template Image"}
          fill
          className="w-full h-full object-cover object-center rounded-2xl shadow"
          priority
        />
      </div>
      <div>
        <h2 className="text-4xl font-bold mb-2 tracking-tight leading-tight">
          {template?.name}
        </h2>
      </div>
      <p className="text-lg text-muted-foreground mb-6">
        {template?.description || "No description provided"}
      </p>
      {template?.variables.length > 0 && (
        <div className="mt-8 w-full mb-10">
          <div className="pb-3 border-b mb-4">
            <div className="text-lg flex font-bold items-center">
              <Variable size={18} className="mr-1" />
              <span>Variables</span>
            </div>
          </div>
          {(() => {
            // Group variables by variable_type name
            const groupedVariables: Record<string, VariableResponse[]> = {};
            template.variables.forEach((variable: VariableResponse) => {
              const typeName = variable.variable_type?.name || 'Other';
              if (!groupedVariables[typeName]) {
                groupedVariables[typeName] = [];
              }
              groupedVariables[typeName].push(variable);
            });

            // Return the grouped variables UI in horizontal layout with limited display
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(groupedVariables).map(([typeName, variables]) => {
                  const isExpanded = expandedTypes[typeName] || false;
                  const visibleVariables = isExpanded ? variables : variables.slice(0, 3);

                  return (
                    <div key={typeName}>
                      <h4 className="text-sm font-semibold mb-3 text-foreground">
                        {typeName}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {visibleVariables.map((variable: VariableResponse) => (
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
      {template.trades.length > 0 && (
        <div className="mt-8 w-full mb-10">
          <div className="pb-3 border-b mb-4">
            <div className="text-lg flex font-bold items-center">
              <Package size={18} className="mr-1" />
              <span>Trades</span>
            </div>
          </div>
          <div className="space-y-3">
            {template.trades.map((trade: TradeResponse) => {
              const isExpanded = expandedTypes[`trade-${trade.id}`] || false;
              const elementCount = trade.elements?.length || 0;
              
              return (
                <div
                  key={trade.id}
                  className="border-l-4 border-l-primary/20 border border-border/20 bg-background hover:bg-muted/30 transition-all duration-200 overflow-hidden rounded-md"
                >
                  {/* Trade Header - Clickable */}
                  <div 
                    className="py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 relative group"
                    onClick={() => setExpandedTypes(prev => ({
                      ...prev,
                      [`trade-${trade.id}`]: !prev[`trade-${trade.id}`]
                    }))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div 
                            className="flex-shrink-0 transition-transform duration-200"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                          >
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{trade.name}</h4>
                              <div className="text-xs px-2 py-0.5 h-5 border rounded-full border-primary/20 text-primary/80">
                                {elementCount} element{elementCount !== 1 ? 's' : ''}
                              </div>
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
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/20 overflow-hidden">
                      <div className="p-4 space-y-3">
                        {/* Trade Image (when expanded) */}
                        {trade.image && (
                          <div className="mb-4">
                            <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-md overflow-hidden border shadow-sm group hover:shadow-md">
                              <div className="w-full h-full overflow-hidden">
                                <Image 
                                  src={trade.image} 
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
                          </div>
                        )}
                        
                        {/* Elements List */}
                        {trade.elements && trade.elements.length > 0 && (
                          <>
                            <div className="flex items-center">
                              <div className="h-0.5 bg-primary/10 flex-grow mr-2"></div>
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Elements</span>
                              <div className="h-0.5 bg-primary/10 flex-grow ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                              {trade.elements?.map((element: ElementResponse) => (
                                <div className="border rounded-md p-3 bg-background/80 hover:shadow-sm hover:bg-background transition-all" key={element.id}>
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
                                  
                                  {/* Element Image (if available) */}
                                  {element.image && (
                                    <div className="my-3 relative w-full h-28 rounded-md overflow-hidden border shadow-sm">
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
                                              {element.material_cost_formula ? replaceVariableIdsWithNames(
                                                element.material_cost_formula,
                                                template.variables,
                                                element.material_formula_variables || []
                                              ) : ''}
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
                                              {element.labor_cost_formula ? replaceVariableIdsWithNames(
                                                element.labor_cost_formula,
                                                template.variables,
                                                element.labor_formula_variables || []
                                              ) : ''}
                                            </code>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Empty State - No Content */}
      {(!template?.variables || template.variables.length === 0) && (!template?.trades || template.trades.length === 0) && (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-md my-8">
          <p className="text-lg">No content</p>
          <p className="text-sm mt-1">This template has no variables or trades defined</p>
        </div>
      )}
    </div>
  );
}
