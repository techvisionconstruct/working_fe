import React, { useState, useEffect } from "react";
import {
  Card,
  Badge,
  Separator,
  Button,
  Input,
  Label,
  Switch,
} from "@/components/shared";
import { Check, PlusCircle, X, Loader2, Search, Plus } from "lucide-react";
import {
  Module,
  Element,
  ElementWithValues,
  Template,
  Parameter,
} from "./types";

interface ModulesTabProps {
  modules: {
    isLoading: boolean;
    data?: Module[];
  };
  elements: {
    isLoading: boolean;
    data?: Element[];
  };
  selectedModules: Module[];
  selectedElements: ElementWithValues[];
  selectedTemplate: any;
  selectedParameters?: Parameter[];
  customModules?: Module[];
  handleModuleToggle: (module: Module) => void;
  handleAddCustomModule?: (module: Module) => void;
  handleElementToggle: (element: Element, module: Module) => void;
  handleElementValueUpdate: (
    elementId: number,
    module: Module,
    field: string,
    formula: string,
    value: number
  ) => void;
  onBack: () => void;
  onNext: () => void;
  errors?: Record<string, string>;
}

export function ModulesTab({
  modules,
  elements,
  selectedModules,
  selectedElements,
  selectedTemplate,
  selectedParameters = [],
  customModules = [],
  handleModuleToggle,
  handleAddCustomModule,
  handleElementToggle,
  handleElementValueUpdate,
  onBack,
  onNext,
  errors = {},
}: ModulesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [elementSearchQueries, setElementSearchQueries] = useState<
    Record<number, string>
  >({});
  const [editingFormulas, setEditingFormulas] = useState<
    Record<
      string,
      {
        formula: boolean;
        labor_formula: boolean;
      }
    >
  >({});
  const [useGlobalMarkup, setUseGlobalMarkup] = useState(false);
  const [globalMarkupValue, setGlobalMarkupValue] = useState(15);

  const [parameterSuggestions, setParameterSuggestions] = useState<Parameter[]>(
    []
  );
  const [activeSuggestionField, setActiveSuggestionField] = useState<{
    elementId: number;
    moduleId: number;
    field: "formula" | "labor_formula";
  } | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const originalElementMarkups = React.useRef<Record<string, number>>({});

  const filteredModules = modules.data?.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const prevGlobalMarkupRef = React.useRef({ enabled: false, value: 15 });

  useEffect(() => {
    const toggleChanged =
      useGlobalMarkup !== prevGlobalMarkupRef.current.enabled;
    const valueChangedWhileEnabled =
      useGlobalMarkup &&
      globalMarkupValue !== prevGlobalMarkupRef.current.value;

    if (toggleChanged || valueChangedWhileEnabled) {
      if (selectedElements.length > 0) {
        if (useGlobalMarkup && toggleChanged) {
          selectedElements.forEach((elementObj) => {
            const key = `${elementObj.element.id}-${elementObj.module.id}`;
            originalElementMarkups.current[key] = elementObj.markup;
          });

          selectedElements.forEach((elementObj) => {
            handleElementValueUpdate(
              elementObj.element.id,
              elementObj.module,
              "markup",
              "",
              globalMarkupValue
            );
          });
        } else if (!useGlobalMarkup && toggleChanged) {
          selectedElements.forEach((elementObj) => {
            const key = `${elementObj.element.id}-${elementObj.module.id}`;
            const originalValue = originalElementMarkups.current[key];

            if (originalValue !== undefined) {
              handleElementValueUpdate(
                elementObj.element.id,
                elementObj.module,
                "markup",
                "",
                originalValue
              );
            }
          });
        } else if (useGlobalMarkup && valueChangedWhileEnabled) {
          selectedElements.forEach((elementObj) => {
            handleElementValueUpdate(
              elementObj.element.id,
              elementObj.module,
              "markup",
              "",
              globalMarkupValue
            );
          });
        }
      }

      prevGlobalMarkupRef.current = {
        enabled: useGlobalMarkup,
        value: globalMarkupValue,
      };
    }
  }, [useGlobalMarkup, globalMarkupValue]);

  const handleCreateNewModule = () => {
    if (!searchQuery.trim()) return;

    const customModule: Module = {
      id: Date.now(),
      name: searchQuery.trim(),
      description: "Newly created module",
    };

    if (handleAddCustomModule) {
      handleAddCustomModule(customModule);
    } else {
      handleModuleToggle(customModule);
    }

    setSearchQuery("");
  };

  const handleElementSearch = (moduleId: number, query: string) => {
    setElementSearchQueries((prev) => ({
      ...prev,
      [moduleId]: query,
    }));
  };

  const handleCreateNewElement = (module: Module) => {
    const query = elementSearchQueries[module.id];
    if (!query?.trim()) return;

    const newElement: Element = {
      id: Date.now(),
      name: query.trim(),
      description: "Newly created element",
      formula: "",
      labor_formula: "",
    };

    handleElementToggle(newElement, module);

    setElementSearchQueries((prev) => ({
      ...prev,
      [module.id]: "",
    }));
  };

  const toggleFormulaEdit = (
    elementId: number,
    moduleId: number,
    field: "formula" | "labor_formula"
  ) => {
    const key = `${elementId}-${moduleId}`;

    setEditingFormulas((prev) => {
      const current = prev[key] || { formula: false, labor_formula: false };

      return {
        ...prev,
        [key]: {
          ...current,
          [field]: !current[field],
        },
      };
    });
  };

  const isFormulaEditing = (
    elementId: number,
    moduleId: number,
    field: "formula" | "labor_formula"
  ): boolean => {
    const key = `${elementId}-${moduleId}`;
    return editingFormulas[key]?.[field] || false;
  };

  const handleFormulaInputChange = (
    elementId: number,
    moduleId: number,
    field: "formula" | "labor_formula",
    value: string,
    cursorPos: number
  ) => {
    handleElementValueUpdate(
      elementId,
      selectedModules.find((m) => m.id === moduleId)!,
      field,
      value,
      0
    );

    setCursorPosition(cursorPos);

    const textBeforeCursor = value.substring(0, cursorPos);

    const usedParameters = new Set<string>();

    const paramRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    let match;

    while ((match = paramRegex.exec(value)) !== null) {
      usedParameters.add(match[1]);
    }

    const lastWord =
      textBeforeCursor
        .trim()
        .split(/[\+\-*/()=]/g)
        .pop()
        ?.trim() || "";

    if (lastWord) {
      const filteredParams = selectedParameters.filter((param) => {
        const nameMatches = param.name
          .toLowerCase()
          .includes(lastWord.toLowerCase());

        const isCurrentlyTyping = param.name
          .toLowerCase()
          .startsWith(lastWord.toLowerCase());

        return (
          nameMatches && (!usedParameters.has(param.name) || isCurrentlyTyping)
        );
      });

      setParameterSuggestions(filteredParams);
      setActiveSuggestionField({
        elementId,
        moduleId,
        field,
      });
    } else {
      clearSuggestions();
    }
  };

  const clearSuggestions = () => {
    setParameterSuggestions([]);
    setActiveSuggestionField(null);
  };

  const insertParameterToFormula = (
    param: Parameter,
    elementId: number,
    moduleId: number,
    field: "formula" | "labor_formula"
  ) => {
    const elementObj = selectedElements.find(
      (e) => e.element.id === elementId && e.module.id === moduleId
    );

    if (!elementObj) return;

    const currentFormula =
      field === "formula"
        ? elementObj.formula || ""
        : elementObj.labor_formula || "";

    const beforeCursor = currentFormula.substring(0, cursorPosition);
    const afterCursor = currentFormula.substring(cursorPosition);

    const lastExpressionPart =
      beforeCursor
        .trim()
        .split(/[\+\-*/()=]/g)
        .pop()
        ?.trim() || "";

    if (lastExpressionPart) {
      const searchTermIndex = beforeCursor.lastIndexOf(lastExpressionPart);

      if (searchTermIndex !== -1) {
        const textBeforeSearchTerm = beforeCursor.substring(0, searchTermIndex);

        const newFormula = textBeforeSearchTerm + param.name + afterCursor;

        handleElementValueUpdate(
          elementId,
          selectedModules.find((m) => m.id === moduleId)!,
          field,
          newFormula,
          0
        );

        setCursorPosition(textBeforeSearchTerm.length + param.name.length);
      }
    } else {
      const newFormula = beforeCursor + param.name + afterCursor;

      handleElementValueUpdate(
        elementId,
        selectedModules.find((m) => m.id === moduleId)!,
        field,
        newFormula,
        0
      );

      setCursorPosition(beforeCursor.length + param.name.length);
    }

    // Clear suggestions after inserting
    clearSuggestions();
  };

  return (
    <div className="space-y-6">
      {/* Validation error alerts */}
      {(errors["selectedModules"] || errors["selectedElements"]) && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              {errors["selectedModules"] && (
                <p className="text-sm font-medium">
                  {errors["selectedModules"]}
                </p>
              )}
              {errors["selectedElements"] && (
                <p className="text-sm font-medium mt-1">
                  {errors["selectedElements"]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-2">Selected Modules</h2>
        <div className="flex justify-between items-start gap-4">
          <p className="text-sm text-muted-foreground max-w-md">
            Choose the modules that apply to this proposal.
          </p>
          <div className="relative w-64 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex">
              <Input
                type="text"
                placeholder="Search modules..."
                className="pl-10 rounded-r-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (filteredModules?.length === 0 && searchQuery.trim()) {
                      handleCreateNewModule();
                    }
                  }
                }}
              />
              {searchQuery && (
                <Button
                  type="button"
                  size="sm"
                  className="rounded-l-none h-10"
                  onClick={handleCreateNewModule}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>

            {searchQuery && filteredModules?.length === 0 && (
              <div className="absolute z-10 bg-card border rounded-md shadow-md w-full mt-1 overflow-hidden">
                <div className="px-4 py-3 text-sm">
                  No modules found. Press{" "}
                  <kbd className="px-2 py-0.5 rounded-md bg-muted text-xs">
                    Enter
                  </kbd>{" "}
                  or click the Add button to create a new module.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {modules.isLoading ? (
            <div className="col-span-full flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredModules?.length || customModules.length ? (
            <>
              {filteredModules?.map((module) => {
                const isSelected = selectedModules.some(
                  (m) => m.id === module.id
                );
                return (
                  <Card
                    key={module.id}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleModuleToggle(module)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{module.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {module.description}
                        </p>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
                    </div>
                  </Card>
                );
              })}

              {customModules
                .filter((module) =>
                  module.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((module) => (
                  <Card
                    key={`custom-module-${module.id}`}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedModules.some((m) => m.id === module.id)
                        ? "ring-2 ring-primary"
                        : "hover:border-primary/50"
                    } border-dashed`}
                    onClick={() => handleModuleToggle(module)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold flex items-center">
                          {module.name}
                          <Badge className="ml-2" variant="outline">
                            New
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {module.description}
                        </p>
                      </div>
                      {selectedModules.some((m) => m.id === module.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </Card>
                ))}
            </>
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              {searchQuery
                ? "No matching modules found."
                : "No modules available."}
            </div>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="text-lg font-medium mb-2">Elements for Each Module</h2>

        {/* Global Markup Control */}
        <div className="bg-muted/30 border rounded-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Global Markup Percentage</h3>
              <p className="text-xs text-muted-foreground">
                Apply the same markup percentage to all elements
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="globalMarkupValue" className="text-sm">
                  Markup Value:
                </Label>
                <Input
                  id="globalMarkupValue"
                  type="number"
                  min="0"
                  className="w-20 h-9 text-sm"
                  value={globalMarkupValue}
                  onChange={(e) =>
                    setGlobalMarkupValue(parseFloat(e.target.value))
                  }
                  disabled={!useGlobalMarkup}
                />
                <span className="text-sm">%</span>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="useGlobalMarkup" className="text-sm">
                  Enable:
                </Label>
                <Switch
                  id="useGlobalMarkup"
                  checked={useGlobalMarkup}
                  onCheckedChange={setUseGlobalMarkup}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Add specific elements to your selected modules.
        </p>

        {selectedModules.length > 0 ? (
          selectedModules.map((module) => (
            <div key={module.id} className="mt-6">
              <h3 className="text-md font-medium mb-2">{module.name}</h3>

              <div className="border rounded-lg p-4">
                <div className="flex flex-wrap gap-2 mb-4 justify-between">
                  <div className="flex flex-wrap gap-2">
                    {elements.data
                      ?.filter(
                        (element) =>
                          !selectedElements.some(
                            (e) =>
                              e.element.id === element.id &&
                              e.module.id === module.id
                          ) &&
                          (!elementSearchQueries[module.id] ||
                            element.name
                              .toLowerCase()
                              .includes(
                                elementSearchQueries[
                                  module.id
                                ]?.toLowerCase() || ""
                              ))
                      )
                      .map((element) => (
                        <Badge
                          key={element.id}
                          variant="outline"
                          className="cursor-pointer px-3 py-2 hover:bg-accent"
                          onClick={() => handleElementToggle(element, module)}
                        >
                          <PlusCircle className="h-3 w-3 mr-1" /> {element.name}
                        </Badge>
                      ))}
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="flex">
                      <Input
                        type="text"
                        placeholder="Search or add element..."
                        className="pl-3 pr-3 rounded-r-none text-sm h-9 w-64"
                        value={elementSearchQueries[module.id] || ""}
                        onChange={(e) =>
                          handleElementSearch(module.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            elementSearchQueries[module.id]?.trim()
                          ) {
                            const searchTerm =
                              elementSearchQueries[module.id].toLowerCase();
                            const matchedElement = elements.data?.find(
                              (el) =>
                                el.name.toLowerCase().includes(searchTerm) &&
                                !selectedElements.some(
                                  (se) =>
                                    se.element.id === el.id &&
                                    se.module.id === module.id
                                )
                            );

                            if (matchedElement) {
                              handleElementToggle(matchedElement, module);
                              handleElementSearch(module.id, "");
                            } else {
                              handleCreateNewElement(module);
                            }
                          }
                        }}
                      />
                      {elementSearchQueries[module.id] && (
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-l-none h-9"
                          onClick={() => handleCreateNewElement(module)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>

                    {elementSearchQueries[module.id]?.trim() &&
                      !elements.data?.some(
                        (element) =>
                          element.name
                            .toLowerCase()
                            .includes(
                              elementSearchQueries[module.id]?.toLowerCase() ||
                                ""
                            ) &&
                          !selectedElements.some(
                            (e) =>
                              e.element.id === element.id &&
                              e.module.id === module.id
                          )
                      ) && (
                        <div className="absolute z-10 text-sm text-muted-foreground mt-1 border rounded-md p-2 bg-card w-full shadow-md right-0">
                          No matching elements found. Press{" "}
                          <kbd className="px-1 py-0.5 rounded bg-muted text-xs">
                            Enter
                          </kbd>{" "}
                          or click the Add button to create "
                          {elementSearchQueries[module.id]}" as a new element.
                        </div>
                      )}
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedElements
                    .filter((e) => e.module.id === module.id)
                    .map((elementObj) => (
                      <div
                        key={`${elementObj.element.id}-${module.id}`}
                        className="flex flex-col gap-3 border rounded-md p-3"
                      >
                        {/* Header row with element name and costs */}
                        <div className="flex flex-row justify-between items-center w-full">
                          <div>
                            <span className="font-medium text-sm">
                              {elementObj.element.name}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {elementObj.element.description}
                            </p>
                          </div>

                          {/* Costs and Markup section - Inline with element name */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs whitespace-nowrap">
                                Material $:
                              </Label>
                              <div className="w-14 h-7 flex items-center text-xs">
                                ${elementObj.material_cost.toFixed(2)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Label className="text-xs whitespace-nowrap">
                                Labor $:
                              </Label>
                              <div className="w-14 h-7 flex items-center text-xs">
                                ${elementObj.labor_cost.toFixed(2)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Label className="text-xs whitespace-nowrap">
                                Markup %:
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                className="w-20 h-7 text-xs px-2"
                                value={elementObj.markup}
                                onChange={(e) =>
                                  handleElementValueUpdate(
                                    elementObj.element.id,
                                    module,
                                    "markup",
                                    "",
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleElementToggle(elementObj.element, module)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Formulas section - Below element name */}
                        <div className="flex flex-col gap-2">
                          {/* Material Formula */}
                          <div className="flex items-center gap-1">
                            <Label className="text-xs whitespace-nowrap">
                              Material Formula:
                            </Label>
                            {isFormulaEditing(
                              elementObj.element.id,
                              module.id,
                              "formula"
                            ) ? (
                              <div className="flex items-center relative">
                                <Input
                                  type="text"
                                  className="h-7 text-xs w-[200px] px-2"
                                  value={elementObj.formula || ""}
                                  onChange={(e) =>
                                    handleFormulaInputChange(
                                      elementObj.element.id,
                                      module.id,
                                      "formula",
                                      e.target.value,
                                      e.target.selectionStart || 0
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      if (
                                        parameterSuggestions.length > 0 &&
                                        activeSuggestionField?.elementId ===
                                          elementObj.element.id &&
                                        activeSuggestionField?.moduleId ===
                                          module.id &&
                                        activeSuggestionField?.field ===
                                          "formula"
                                      ) {
                                        insertParameterToFormula(
                                          parameterSuggestions[0],
                                          elementObj.element.id,
                                          module.id,
                                          "formula"
                                        );
                                        e.preventDefault();
                                      } else {
                                        toggleFormulaEdit(
                                          elementObj.element.id,
                                          module.id,
                                          "formula"
                                        );
                                        clearSuggestions();
                                      }
                                    } else if (e.key === "Escape") {
                                      clearSuggestions();
                                    } else if (
                                      e.key === "Backspace" ||
                                      e.key === "Delete"
                                    ) {
                                      const value = elementObj.formula || "";
                                      const cursorPos =
                                        e.currentTarget.selectionStart || 0;
                                      if (
                                        e.key === "Backspace" &&
                                        cursorPos > 0
                                      ) {
                                        const textBeforeCursor =
                                          value.substring(0, cursorPos);
                                        const paramMatch =
                                          textBeforeCursor.match(
                                            /(\b[a-zA-Z_][a-zA-Z0-9_ ]*)\s*$/
                                          );
                                        if (
                                          paramMatch &&
                                          selectedParameters.some(
                                            (p) => p.name === paramMatch[1]
                                          )
                                        ) {
                                          const newValue =
                                            textBeforeCursor.substring(
                                              0,
                                              textBeforeCursor.length -
                                                paramMatch[1].length
                                            ) + value.substring(cursorPos);
                                          handleElementValueUpdate(
                                            elementObj.element.id,
                                            module,
                                            "formula",
                                            newValue,
                                            0
                                          );
                                          setTimeout(() => {
                                            const newCursorPos =
                                              cursorPos - paramMatch[1].length;
                                            e.currentTarget.setSelectionRange(
                                              newCursorPos,
                                              newCursorPos
                                            );
                                          }, 0);

                                          e.preventDefault();
                                        }
                                      }

                                      if (
                                        e.key === "Delete" &&
                                        cursorPos < value.length
                                      ) {
                                        const textAfterCursor =
                                          value.substring(cursorPos);

                                        const paramMatch =
                                          textAfterCursor.match(
                                            /^(\b[a-zA-Z_][a-zA-Z0-9_ ]*)\b/
                                          );

                                        if (
                                          paramMatch &&
                                          selectedParameters.some(
                                            (p) => p.name === paramMatch[1]
                                          )
                                        ) {
                                          const newValue =
                                            value.substring(0, cursorPos) +
                                            textAfterCursor.substring(
                                              paramMatch[1].length
                                            );

                                          handleElementValueUpdate(
                                            elementObj.element.id,
                                            module,
                                            "formula",
                                            newValue,
                                            0
                                          );

                                          setTimeout(() => {
                                            e.currentTarget.setSelectionRange(
                                              cursorPos,
                                              cursorPos
                                            );
                                          }, 0);

                                          e.preventDefault();
                                        }
                                      }
                                    }
                                  }}
                                  onBlur={() => {
                                    setTimeout(() => clearSuggestions(), 200);
                                  }}
                                  onSelect={(e) => {
                                    setCursorPosition(
                                      e.currentTarget.selectionStart || 0
                                    );
                                  }}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 ml-1"
                                  onClick={() => {
                                    toggleFormulaEdit(
                                      elementObj.element.id,
                                      module.id,
                                      "formula"
                                    );
                                    clearSuggestions();
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>

                                {activeSuggestionField &&
                                  activeSuggestionField.elementId ===
                                    elementObj.element.id &&
                                  activeSuggestionField.moduleId ===
                                    module.id &&
                                  activeSuggestionField.field === "formula" &&
                                  parameterSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 mt-1 w-[200px] max-h-40 overflow-y-auto bg-white dark:bg-gray-800 border rounded-md shadow-md z-50">
                                      <ul className="py-1">
                                        {parameterSuggestions.map((param) => (
                                          <li
                                            key={param.id}
                                            className="px-3 py-1 text-xs hover:bg-primary/10 cursor-pointer flex justify-between items-center"
                                            onClick={() =>
                                              insertParameterToFormula(
                                                param,
                                                elementObj.element.id,
                                                module.id,
                                                "formula"
                                              )
                                            }
                                          >
                                            <span className="font-medium">
                                              {param.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                              {param.value}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <div className="h-7 text-xs px-2 border rounded flex items-center w-[200px] bg-muted/20">
                                  {elementObj.formula || "No formula"}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 ml-1"
                                  onClick={() =>
                                    toggleFormulaEdit(
                                      elementObj.element.id,
                                      module.id,
                                      "formula"
                                    )
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                    <path d="m15 5 4 4"></path>
                                  </svg>
                                </Button>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs whitespace-nowrap">
                                Labor Formula:
                              </Label>
                              {isFormulaEditing(
                                elementObj.element.id,
                                module.id,
                                "labor_formula"
                              ) ? (
                                <div className="flex items-center relative">
                                  <Input
                                    type="text"
                                    className="h-7 text-xs w-[200px] px-2"
                                    value={elementObj.labor_formula || ""}
                                    onChange={(e) =>
                                      handleFormulaInputChange(
                                        elementObj.element.id,
                                        module.id,
                                        "labor_formula",
                                        e.target.value,
                                        e.target.selectionStart || 0
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        if (
                                          parameterSuggestions.length > 0 &&
                                          activeSuggestionField?.elementId ===
                                            elementObj.element.id &&
                                          activeSuggestionField?.moduleId ===
                                            module.id &&
                                          activeSuggestionField?.field ===
                                            "labor_formula"
                                        ) {
                                          insertParameterToFormula(
                                            parameterSuggestions[0],
                                            elementObj.element.id,
                                            module.id,
                                            "labor_formula"
                                          );
                                          e.preventDefault();
                                        } else {
                                          toggleFormulaEdit(
                                            elementObj.element.id,
                                            module.id,
                                            "labor_formula"
                                          );
                                          clearSuggestions();
                                        }
                                      } else if (e.key === "Escape") {
                                        clearSuggestions();
                                      } else if (
                                        e.key === "Backspace" ||
                                        e.key === "Delete"
                                      ) {
                                        const value =
                                          elementObj.labor_formula || "";
                                        const cursorPos =
                                          e.currentTarget.selectionStart || 0;

                                        if (
                                          e.key === "Backspace" &&
                                          cursorPos > 0
                                        ) {
                                          const textBeforeCursor =
                                            value.substring(0, cursorPos);

                                          const paramMatch =
                                            textBeforeCursor.match(
                                              /(\b[a-zA-Z_][a-zA-Z0-9_ ]*)\s*$/
                                            );

                                          if (
                                            paramMatch &&
                                            selectedParameters.some(
                                              (p) => p.name === paramMatch[1]
                                            )
                                          ) {
                                            const newValue =
                                              textBeforeCursor.substring(
                                                0,
                                                textBeforeCursor.length -
                                                  paramMatch[1].length
                                              ) + value.substring(cursorPos);

                                            handleElementValueUpdate(
                                              elementObj.element.id,
                                              module,
                                              "labor_formula",
                                              newValue,
                                              0
                                            );

                                            setTimeout(() => {
                                              const newCursorPos =
                                                cursorPos -
                                                paramMatch[1].length;
                                              e.currentTarget.setSelectionRange(
                                                newCursorPos,
                                                newCursorPos
                                              );
                                            }, 0);

                                            e.preventDefault();
                                          }
                                        }

                                        if (
                                          e.key === "Delete" &&
                                          cursorPos < value.length
                                        ) {
                                          const textAfterCursor =
                                            value.substring(cursorPos);

                                          const paramMatch =
                                            textAfterCursor.match(
                                              /^(\b[a-zA-Z_][a-zA-Z0-9_ ]*)\b/
                                            );

                                          if (
                                            paramMatch &&
                                            selectedParameters.some(
                                              (p) => p.name === paramMatch[1]
                                            )
                                          ) {
                                            const newValue =
                                              value.substring(0, cursorPos) +
                                              textAfterCursor.substring(
                                                paramMatch[1].length
                                              );

                                            handleElementValueUpdate(
                                              elementObj.element.id,
                                              module,
                                              "labor_formula",
                                              newValue,
                                              0
                                            );

                                            setTimeout(() => {
                                              e.currentTarget.setSelectionRange(
                                                cursorPos,
                                                cursorPos
                                              );
                                            }, 0);

                                            e.preventDefault();
                                          }
                                        }
                                      }
                                    }}
                                    onBlur={() => {
                                      setTimeout(() => clearSuggestions(), 200);
                                    }}
                                    onSelect={(e) => {
                                      setCursorPosition(
                                        e.currentTarget.selectionStart || 0
                                      );
                                    }}
                                    autoFocus
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 ml-1"
                                    onClick={() => {
                                      toggleFormulaEdit(
                                        elementObj.element.id,
                                        module.id,
                                        "labor_formula"
                                      );
                                      clearSuggestions();
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>

                                  {activeSuggestionField &&
                                    activeSuggestionField.elementId ===
                                      elementObj.element.id &&
                                    activeSuggestionField.moduleId ===
                                      module.id &&
                                    activeSuggestionField.field ===
                                      "labor_formula" &&
                                    parameterSuggestions.length > 0 && (
                                      <div className="absolute top-full left-0 mt-1 w-[200px] max-h-40 overflow-y-auto bg-white dark:bg-gray-800 border rounded-md shadow-md z-50">
                                        <ul className="py-1">
                                          {parameterSuggestions.map((param) => (
                                            <li
                                              key={param.id}
                                              className="px-3 py-1 text-xs hover:bg-primary/10 cursor-pointer flex justify-between items-center"
                                              onClick={() =>
                                                insertParameterToFormula(
                                                  param,
                                                  elementObj.element.id,
                                                  module.id,
                                                  "labor_formula"
                                                )
                                              }
                                            >
                                              <span className="font-medium">
                                                {param.name}
                                              </span>
                                              <span className="text-muted-foreground">
                                                {param.value}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="h-7 text-xs px-2 border rounded flex items-center w-[200px] bg-muted/20">
                                    {elementObj.labor_formula || "No formula"}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 ml-1"
                                    onClick={() =>
                                      toggleFormulaEdit(
                                        elementObj.element.id,
                                        module.id,
                                        "labor_formula"
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                      <path d="m15 5 4 4"></path>
                                    </svg>
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Label className="text-sm whitespace-nowrap font-medium">
                                Total:
                              </Label>
                              <div className="w-20 h-7 flex items-center text-sm font-medium">
                                $
                                {(
                                  (elementObj.material_cost +
                                    elementObj.labor_cost) *
                                  (1 + elementObj.markup / 100)
                                ).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {selectedElements.filter((e) => e.module.id === module.id)
                    .length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      No elements added to this module yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground border rounded-lg mt-4">
            Please select at least one module to add elements.
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Template
        </Button>
        <Button onClick={onNext}>Continue to Parameters</Button>
      </div>
    </div>
  );
}
