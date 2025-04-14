"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Card, 
  Input, 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/shared";
import { PlusCircle, XCircle, Plus, Check, ChevronsUpDown } from "lucide-react";
import { TemplateCategoriesProps } from "@/types/templates";
import { useCategories, Module } from "@/hooks/api/lookup/use-categories"; 

export default function TemplateCategories({ template, onUpdateTemplate, onNext, onPrevious }: TemplateCategoriesProps) {
  const [modulesList, setModules] = useState<Module[]>([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { modules, isLoading, error } = useCategories();
  
  const filteredModules = modules?.filter((module) => 
    module.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const [elementName, setElementName] = useState("");
  const [materialCostFormula, setMaterialCostFormula] = useState("");
  const [laborCostFormula, setLaborCostFormula] = useState("");
  
  useEffect(() => {
    if (template.modules && template.modules.length > 0) {
      setModules(template.modules);
      setSelectedModule(template.modules[0].id);
    } else {
      setModules([]);
      setSelectedModule(null);
    }
  }, [template.modules]);

  const addModule = () => {
    if (!newModuleName.trim()) return;
    
    const newModule = {
      id: modulesList.length + 1,
      name: newModuleName,
      elements: []
    };
    
    const updatedModules = [...modulesList, newModule];
    setModules(updatedModules);
    setNewModuleName("");
    setSelectedModule(newModule.id);

    onUpdateTemplate({
      ...template,
      modules: updatedModules
    });
  };

  const removeModule = (id: number) => {
    const updatedModules = modulesList.filter((module: Module) => module.id !== id);
    setModules(updatedModules);
    setSelectedModule(null);

    onUpdateTemplate({
      ...template,
      modules: updatedModules
    });
  };

  const addElement = (moduleId: number) => {
    if (!elementName.trim()) return;
    
    const updatedModules = modulesList.map((module) => {
      if (module.id === moduleId) {
        const newElement= {
          id: (module.elements.length > 0 ? Math.max(...module.elements.map((el) => el.id)) : 0) + 1,
          name: elementName,
          formula: materialCostFormula,
          labor_formula: laborCostFormula
        };
        
        return {
          ...module,
          elements: [...module.elements, newElement]
        };
      }
      return module;
    });
    
    setModules(updatedModules);
    setElementName("");
    // setMaterialCostFormula("");
    // setLaborCostFormula("");
    onUpdateTemplate({
      ...template,
      modules: updatedModules
    });
  };

  const removeElement = (moduleId: number, elementId: number) => {
    const updatedModules = modulesList.map((module) => {
      if (module.id === moduleId) {
        return {
          ...module,
          elements: module.elements.filter((element) => element.id !== elementId)
        };
      }
      return module;
    });
    
    setModules(updatedModules);
  
    onUpdateTemplate({
      ...template,
      modules: updatedModules
    });
  };

  const handleSaveAndContinue = () => {
    onUpdateTemplate({
      ...template,
      modules: modulesList
    });
    onNext();
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Template Categories</h2>
      <p className="text-gray-600 mb-4">
        Create categories and define elements with cost formulas for your template.
      </p>

      <div className="space-y-6">
    
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              placeholder="Enter module name"
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={addModule} className="flex-1">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Module
            </Button>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="flex-1 justify-between">
                  <span>Select Module</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search categories..." 
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandEmpty>
                    {isLoading ? "Loading..." : "No categories found."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {error ? (
                      <div className="p-2 text-center text-red-500 text-sm">
                        Error loading categories
                      </div>
                    ) : filteredModules.length === 0 && !isLoading ? (
                      <div className="p-2 text-center text-sm">
                        No matching categories
                      </div>
                    ) : (
                      filteredModules.map((module) => {
                        // Check if this module is already added
                        const isSelected = modulesList.some(
                          (mod) => mod.name === module.name
                        );
                        
                        return (
                          <CommandItem
                            key={module.id}
                            value={module.name}
                            onSelect={() => {
                              if (!isSelected) {
                                const newModule = {
                                  id: modulesList.length + 1,
                                  name: module.name,
                                  elements: module.elements?.map(elem => ({
                                    id: elem.id,
                                    name: elem.name,
                                    formula: elem.formula || '',
                                    labor_formula: elem.labor_formula || ''
                                  })) || []
                                };
                                
                                const updatedModules = [...modulesList, newModule];
                                setModules(updatedModules);
                                setSelectedModule(newModule.id);
                                
                                onUpdateTemplate({
                                  ...template,
                                  modules: updatedModules
                                });
                              } else {
                      
                                const updatedModules = modulesList.filter(
                                  (cat) => cat.name !== module.name
                                );
                                setModules(updatedModules);
                                
                                
                                onUpdateTemplate({
                                  ...template,
                                  modules: updatedModules
                                });
                              }
                              // Keep dropdown open for multiple selections
                              setOpen(false);
                            }}
                          >
                            <div className="flex flex-1 items-center justify-between">
                              <div>
                                <span className="font-medium">{module.name}</span>
                                <span className="block text-xs text-gray-400 mt-1">
                                  {module.elements?.length || 0} elements
                                </span>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-black" />}
                            </div>
                          </CommandItem>
                        );
                      })
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Categories and Elements */}
        {modulesList.length > 0 && (
          <Accordion type="single" collapsible defaultValue={selectedModule ? `module-${selectedModule}` : ""}>
            {modulesList.map((module) => (
              <AccordionItem key={module.id} value={`module-${module.id}`}>
                <div className="flex items-center justify-between pr-3">
                  <AccordionTrigger className="flex-grow" onClick={() => setSelectedModule(module.id)}>
                    {module.name}
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeModule(module.id);
                    }}
                  >
                    <XCircle className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
                <AccordionContent>
                  <div className="p-4 border rounded-md mt-2 mb-4">
                    <h4 className="font-medium mb-3">Add New Element</h4>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor={`element-name-${module.id}`} className="block text-sm mb-1">
                          Element Name
                        </label>
                        <Input
                          id={`element-name-${module.id}`}
                          value={elementName}
                          onChange={(e) => setElementName(e.target.value)}
                          placeholder="e.g. Wall Framing"
                        />
                      </div>
                      <div>
                        <label htmlFor={`material-cost-${module.id}`} className="block text-sm mb-1">
                          Material Cost Formula
                        </label>
                        <Input
                          id={`material-cost-${module.id}`}
                          value={materialCostFormula}
                          onChange={(e) => setMaterialCostFormula(e.target.value)}
                          placeholder="e.g. Wall Length * Wall Width * Material Cost"
                        />
                      </div>
                      <div>
                        <label htmlFor={`labor-cost-${module.id}`} className="block text-sm mb-1">
                          Labor Cost Formula
                        </label>
                        <Input
                          id={`labor-cost-${module.id}`}
                          value={laborCostFormula}
                          onChange={(e) => setLaborCostFormula(e.target.value)}
                          placeholder="e.g. Wall Length * Wall Width * Hourly Rate"
                        />
                      </div>
                      <Button size="sm" onClick={() => addElement(module.id)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Element
                      </Button>
                    </div>

                    {/* List of elements */}
                    {module.elements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Elements</h4>
                        <div className="border rounded-md divide-y">
                          {module.elements.map((element) => (
                            <div
                              key={element.id}
                              className="p-3"
                            >
                              <div className="flex justify-between items-start">
                                <h5 className="font-medium">{element.name}</h5>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeElement(module.id, element.id)}
                                >
                                  <XCircle className="h-5 w-5 text-red-500" />
                                </Button>
                              </div>
                              <div className="mt-2 space-y-1 text-sm">
                                <p><span className="font-medium">Material Formula:</span> {element.formula}</p>
                                <p><span className="font-medium">Labor Formula:</span> {element.labor_formula}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button onClick={handleSaveAndContinue}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
