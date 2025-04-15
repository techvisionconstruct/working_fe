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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
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
    <div className="h-full">
      <Card className="p-8 bg-white shadow-lg rounded-2xl border-0">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center tracking-tight flex items-center justify-center gap-2">
          Template Categories
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-1 text-xs rounded-full border px-1.5 cursor-pointer">📦</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>📦 Categories (modules) help you organize your template by grouping related elements together. Great for keeping things tidy!</span>
            </TooltipContent>
          </Tooltip>
        </h2>
        <div className="mb-6 text-center">
          <p className="text-base text-gray-500 font-light">Organize your template by grouping elements into categories (modules).</p>
        </div>
        {/* Move add new and add existing category inside the colored card */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex gap-3 items-center">
            <label className="block mb-2 text-sm font-medium text-gray-800 flex items-center gap-1">
              Add Category
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 text-xs rounded-full border px-1.5 cursor-pointer">🆕</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>➕ Create a brand new category (module) for your template. Use this for custom groupings!</span>
                </TooltipContent>
              </Tooltip>
            </label>
            <Input
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              onFocus={(e) => e.target.classList.add('ring-2', 'ring-black/10')}
              onBlur={(e) => e.target.classList.remove('ring-2', 'ring-black/10')}
              placeholder="Enter new category name"
              className="flex-1 rounded-xl border-gray-200 bg-gray-50 p-3 text-base focus:ring-2 focus:ring-black/10 transition-all"
              style={{ zIndex: 1 }}
            />
            <Button 
              onClick={addModule} 
              className="rounded-xl px-5 py-2 text-base font-semibold bg-green-800 text-white hover:bg-green-900 shadow-md"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Add
            </Button>
          </div>
          <div className="flex gap-3 items-center">
            {/* Tooltip for Add Existing Category - left of combobox */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs rounded-full border px-1.5 cursor-pointer">📚</span>
              </TooltipTrigger>
              <TooltipContent>
                <span>📚 Pick from categories you’ve already created before. Handy for reusing common groups!</span>
              </TooltipContent>
            </Tooltip>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  role="combobox" 
                  aria-expanded={open} 
                  className="w-full justify-between rounded-xl text-base font-semibold border-gray-200 bg-white hover:bg-gray-50 shadow-sm flex items-center gap-1"
                >
                  <span>Add Existing Category</span>
                  <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0 rounded-xl shadow-md" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search categories..." 
                    value={search}
                    onValueChange={setSearch}
                    className="rounded-xl text-base"
                  />
                  <CommandEmpty>
                    {isLoading ? "Loading..." : "No categories found."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-[180px] overflow-auto">
                    {error ? (
                      <div className="p-2 text-center text-red-500 text-base">
                        Error loading categories
                      </div>
                    ) : filteredModules.length === 0 && !isLoading ? (
                      <div className="p-2 text-center text-base">
                        No matching categories
                      </div>
                    ) : (
                      filteredModules.map((module) => {
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
                              setOpen(false);
                            }}
                            className="text-base"
                          >
                            <div className="flex flex-1 items-center justify-between">
                              <div>
                                <span className="font-semibold">{module.name}</span>
                                <span className="block text-xs text-gray-400 mt-1">
                                  {module.elements?.length || 0} elements
                                </span>
                              </div>
                              {isSelected && <Check className="h-5 w-5 text-black" />}
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
        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {modulesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <span className="text-3xl mb-2">📦</span>
              <span className="font-semibold text-base">No categories added yet.</span>
              <span className="text-xs mt-1">Start by adding a category above.</span>
            </div>
          ) : (
            <div className="flex-1 overflow-visible">
              <Accordion 
                type="single" 
                collapsible 
                defaultValue={selectedModule ? `module-${selectedModule}` : ""}
              >
                {/* Tooltip for the categories list */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">Your Categories</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 text-xs rounded-full border px-1.5 cursor-pointer">🗂️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>🗂️ Here you’ll see all the categories (modules) you’ve added. Expand to manage their elements!</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {modulesList.map((module) => (
                  <AccordionItem 
                    key={module.id} 
                    value={`module-${module.id}`} 
                    className="rounded-xl border-0 bg-gray-50 shadow-md mb-3"
                  >
                    <div className="flex items-center justify-between pr-2">
                      <AccordionTrigger 
                        className="flex-grow text-base font-semibold text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all" 
                        onClick={() => setSelectedModule(module.id)}
                      >
                        {module.name}
                      </AccordionTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeModule(module.id);
                        }}
                        className="rounded-full hover:bg-red-50 h-7 w-7 p-0"
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <AccordionContent className="px-2">
                      <div className="p-4 border-0 rounded-xl bg-white mb-2 shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label htmlFor={`element-name-${module.id}`} className="block text-xs mb-1 font-medium text-gray-800">
                              Element Name
                            </label>
                            <Input
                              id={`element-name-${module.id}`}
                              value={elementName}
                              onChange={(e) => setElementName(e.target.value)}
                              placeholder="e.g. Wall Framing"
                              className="rounded-xl border-gray-200 bg-gray-50 text-base h-8"
                            />
                          </div>
                          <div>
                            <label htmlFor={`material-cost-${module.id}`} className="block text-xs mb-1 font-medium text-gray-800">
                              Material Cost Formula
                            </label>
                            <Input
                              id={`material-cost-${module.id}`}
                              value={materialCostFormula}
                              onChange={(e) => setMaterialCostFormula(e.target.value)}
                              placeholder="e.g. Wall Length * Width"
                              className="rounded-xl border-gray-200 bg-gray-50 text-base h-8"
                            />
                          </div>
                          <div>
                            <label htmlFor={`labor-cost-${module.id}`} className="block text-xs mb-1 font-medium text-gray-800">
                              Labor Cost Formula
                            </label>
                            <Input
                              id={`labor-cost-${module.id}`}
                              value={laborCostFormula}
                              onChange={(e) => setLaborCostFormula(e.target.value)}
                              placeholder="e.g. Hours * Rate"
                              className="rounded-xl border-gray-200 bg-gray-50 text-base h-8"
                            />
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addElement(module.id)} 
                          className="rounded-xl px-3 py-0 h-7 bg-green-800 text-white text-xs font-medium hover:bg-green-900 shadow-md"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add Element
                        </Button>
                        
                        {/* List of elements */}
                        {module.elements.length > 0 && (
                          <div className="mt-4">
                            <div className="border-0 rounded-xl divide-y divide-gray-100 bg-gray-50">
                              {module.elements.map((element) => (
                                <div
                                  key={element.id}
                                  className="p-2 flex justify-between items-center text-base"
                                >
                                  <div>
                                    <h5 className="font-semibold text-gray-800">{element.name}</h5>
                                    <div className="mt-0.5 space-y-0.5 text-xs text-gray-600">
                                      <p><span className="font-medium">Material:</span> {element.formula}</p>
                                      <p><span className="font-medium">Labor:</span> {element.labor_formula}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeElement(module.id, element.id)}
                                    className="rounded-full hover:bg-red-50 h-6 w-6 p-0"
                                  >
                                    <XCircle className="h-3 w-3 text-red-500" />
                                  </Button>
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
            </div>
          )}
        </div>
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={onPrevious} 
            className="px-5 py-2 rounded-xl text-base font-semibold"
          >
            Previous
          </Button>
          <Button 
            onClick={handleSaveAndContinue} 
            className="px-5 py-2 rounded-xl text-base font-semibold bg-black text-white hover:bg-gray-900 shadow-md"
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
