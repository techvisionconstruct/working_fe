"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Textarea,
} from "@/components/shared";
import { BracesIcon, Loader2, AlertCircle, X, Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { VariableResponse } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";
import { ProductResponse } from "@/types/products/dto";
import { FormulaBuilder } from "./formula-builder";
import { FormulaToken, useFormula } from "../hooks/use-formula";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/query-options/products";

// Storage keys for formulas - make them unique to avoid conflicts
const STORAGE_PREFIX = "element_dialog_";
const getStorageKeys = (dialogId: string) => ({
  MATERIAL_KEY: `${STORAGE_PREFIX}material_${dialogId}`,
  LABOR_KEY: `${STORAGE_PREFIX}labor_${dialogId}`,
  IS_OPEN_KEY: `${STORAGE_PREFIX}is_open_${dialogId}`,
});

interface ElementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    markup: number;
    image?: string;
  }) => void;
  elementToEdit?: ElementResponse | null;
  initialName?: string;
  variables: VariableResponse[];
  updateVariables?: React.Dispatch<React.SetStateAction<VariableResponse[]>>;
  isSubmitting: boolean;
  dialogTitle: string;
  submitButtonText: string;
  includeMarkup?: boolean;
  initialMarkup?: number;
  onRequestCreateVariable?: (
    variableName: string,
    callback: (newVariable: VariableResponse) => void
  ) => void;
}

export function ElementDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  elementToEdit,
  initialName = "",
  variables,
  updateVariables,
  isSubmitting,
  dialogTitle,
  submitButtonText,
  includeMarkup = false,
  initialMarkup = 0,
  onRequestCreateVariable,
}: ElementDialogProps) {
  // Generate a unique ID for this dialog instance
  const dialogId = useRef(
    `dialog_${Math.random().toString(36).substring(2, 11)}`
  ).current;
  const storageKeys = getStorageKeys(dialogId);

  // Track if this is the first render of the dialog since opening
  const initialRenderRef = useRef(true);

  const [name, setName] = useState(elementToEdit?.name || initialName);
  const [description, setDescription] = useState(
    elementToEdit?.description || ""
  );
  const [markup, setMarkup] = useState(elementToEdit?.markup || initialMarkup);

  // Image upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localImage, setLocalImage] = useState<string | undefined>(
    elementToEdit?.image || undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track which formula field is active/focused
  const [activeFormulaField, setActiveFormulaField] = useState<
    "material" | "labor" | null
  >(null);

  // Store pending variable information to be processed after creation
  const pendingVariableRef = useRef<{
    variable: VariableResponse | null;
    formulaType: "material" | "labor" | null;
  }>({
    variable: null,
    formulaType: null,
  });

  // Image upload helper functions
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setLocalImage(base64String);
      setIsUploading(false);
      console.log("Image processed as base64");
      toast.success("Image uploaded successfully!");
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to process image. Please try again.");
      console.error("FileReader error:", reader.error);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setLocalImage(undefined);
  };

  // Filter variables to only include those relevant to this template
  const filteredVariables = useMemo(() => {
    if (!variables) return [];
    return variables.filter(
      (variable) =>
        // Include template-specific variables and global variables
        variable && (variable.is_global || variable.origin === "derived")
    );
  }, [variables]);

  // Fetch products to check if formula tokens are products
  const { data: productsData } = useQuery(getProducts(1, 999));

  const {
    materialFormulaTokens,
    setMaterialFormulaTokens,
    laborFormulaTokens,
    setLaborFormulaTokens,
    materialFormulaError,
    laborFormulaError,
    validateFormulaTokens,
    parseFormulaToTokens,
    tokensToFormulaString,
    replaceVariableIdsWithNames,
  } = useFormula();

  // Local storage helper functions
  const saveFormulasToStorage = () => {
    try {
      localStorage.setItem(
        storageKeys.MATERIAL_KEY,
        JSON.stringify(materialFormulaTokens)
      );
      localStorage.setItem(
        storageKeys.LABOR_KEY,
        JSON.stringify(laborFormulaTokens)
      );
      localStorage.setItem(storageKeys.IS_OPEN_KEY, "true");
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  };

  const getFormulasFromStorage = () => {
    try {
      const materialStr = localStorage.getItem(storageKeys.MATERIAL_KEY);
      const laborStr = localStorage.getItem(storageKeys.LABOR_KEY);

      let materialTokens = materialStr ? JSON.parse(materialStr) : [];
      let laborTokens = laborStr ? JSON.parse(laborStr) : [];

      // Validate tokens to prevent errors
      if (!Array.isArray(materialTokens)) materialTokens = [];
      if (!Array.isArray(laborTokens)) laborTokens = [];

      return { materialTokens, laborTokens };
    } catch (err) {
      console.error("Error reading from localStorage:", err);
      return { materialTokens: [], laborTokens: [] };
    }
  };

  const clearFormulaStorage = () => {
    try {
      localStorage.removeItem(storageKeys.MATERIAL_KEY);
      localStorage.removeItem(storageKeys.LABOR_KEY);
      localStorage.removeItem(storageKeys.IS_OPEN_KEY);
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  };

  // Initialize form when opening/editing
  useEffect(() => {
    if (isOpen) {
      // Reset initial render flag when dialog opens
      initialRenderRef.current = true;
      
      // Reset errors and touched state when dialog opens
      setElementErrors({ name: "" });
      setElementTouched({ name: false });

      // Always update the name to match either elementToEdit.name or initialName when dialog opens
      if (elementToEdit) {
        setName(elementToEdit.name);
      } else {
        setName(initialName);
      }

      const wasOpen = localStorage.getItem(storageKeys.IS_OPEN_KEY) === "true";

      if (wasOpen) {
        // Dialog was previously open - restore formulas from localStorage
        const { materialTokens, laborTokens } = getFormulasFromStorage();
        if (materialTokens.length > 0) setMaterialFormulaTokens(materialTokens);
        if (laborTokens.length > 0) setLaborFormulaTokens(laborTokens);
      } else if (elementToEdit) {
        // Initialize from element to edit
        setDescription(elementToEdit.description || "");
        setMarkup(elementToEdit.markup || 0);
        console.log("Loading image from database:", elementToEdit.image);
        
        // Handle the image from database - ensure it's in a displayable format
        if (elementToEdit.image) {
          console.log("Element image details:", {
            imageType: elementToEdit.image.substring(0, 30) + "...",
            isBase64: elementToEdit.image.startsWith("data:"),
            isRelativeUrl: elementToEdit.image.startsWith("/"),
            isAbsoluteUrl: elementToEdit.image.startsWith("http"),
            length: elementToEdit.image.length,
            approximateSizeKB: Math.round(elementToEdit.image.length / 1024)
          });
          
          // If the image is a URL but doesn't start with http/https, prepend it
          if (elementToEdit.image.startsWith('/') && !elementToEdit.image.startsWith('data:')) {
            const fullUrl = `${window.location.origin}${elementToEdit.image}`;
            console.log("Converting relative URL to absolute:", fullUrl);
            setLocalImage(fullUrl);
          } 
          // If it's already a data URL or full URL, use as-is
          else {
            console.log("Using image as-is (data URL or absolute URL)");
            setLocalImage(elementToEdit.image);
          }
        } else {
          console.log("No image found in element data");
          setLocalImage(undefined);
        }

        let materialTokens = [],
          laborTokens = [];

        if (elementToEdit.material_cost_formula) {
          // For variables, we want to display names instead of IDs for better user experience
          let displayFormula = replaceVariableIdsWithNames(
            elementToEdit.material_cost_formula,
            filteredVariables,
            elementToEdit.material_formula_variables || []
          );

          // But for products, we need to preserve the original IDs for proper submission
          // So we don't call replaceProductIdsWithNames here

          materialTokens = parseFormulaToTokens(displayFormula);
          console.log("displayFormula", displayFormula);
          console.log("Initial material tokens:", materialTokens);
          console.log(
            "Material formula variables:",
            elementToEdit.material_formula_variables
          );

          // After parsing, ensure all product references are correctly identified
          materialTokens = materialTokens.map((token) => {
            // Strategy 1: Check if this token appears in material_formula_variables as a product
            if (
              elementToEdit.material_formula_variables &&
              elementToEdit.material_formula_variables.length > 0
            ) {
              const productVariable =
                elementToEdit.material_formula_variables.find(
                  (variable: any) =>
                    (variable.name === token.text ||
                      variable.name === token.displayText) &&
                    variable.type === "product"
                );

              if (productVariable) {
                console.log(
                  "Found product in material_formula_variables:",
                  productVariable
                );
                return {
                  ...token,
                  type: "product" as const,
                  // Store the ID in text for API submission
                  text: productVariable.id,
                  // Use displayText for UI with product: prefix
                  displayText: `${productVariable.name || token.text}`,
                };
              }
            }

            const matchedProduct = productsData.data.find(
              (product: ProductResponse) =>
                product.title.toLowerCase() === token.text.toLowerCase() ||
                token.text.includes(product.id)
            );

            if (matchedProduct) {
              console.log(
                "Found matching product in API data:",
                matchedProduct
              );
              return {
                ...token,
                type: "product" as const,
                // Store the ID in text for API submission
                text: matchedProduct.id,
                // Use displayText for UI with product: prefix
                displayText: `${matchedProduct.title}`,
              };
            }

            return token;
          });

          console.log("Final processed material tokens:", materialTokens);

          setMaterialFormulaTokens(materialTokens);

          // Immediately save to localStorage instead of waiting for the useEffect
          localStorage.setItem(
            storageKeys.MATERIAL_KEY,
            JSON.stringify(materialTokens)
          );
        } else {
          setMaterialFormulaTokens([]);
        }

        if (elementToEdit.labor_cost_formula) {
          // For variables, we want to display names instead of IDs for better user experience
          let displayFormula = replaceVariableIdsWithNames(
            elementToEdit.labor_cost_formula,
            filteredVariables,
            elementToEdit.labor_formula_variables || []
          );

          // But for products, we need to preserve the original IDs for proper submission
          // So we don't call replaceProductIdsWithNames here

          laborTokens = parseFormulaToTokens(displayFormula);
          laborTokens = laborTokens.map((token) => {
            // Strategy 1: Check if this token appears in labor_formula_variables as a product
            if (
              elementToEdit.labor_formula_variables &&
              elementToEdit.labor_formula_variables.length > 0
            ) {
              const productVariable =
                elementToEdit.labor_formula_variables.find(
                  (variable: any) =>
                    (variable.name === token.text ||
                      variable.name === token.displayText) &&
                    variable.type === "product"
                );

              if (productVariable) {
                console.log(
                  "Found product in labor_formula_variables:",
                  productVariable
                );
                return {
                  ...token,
                  type: "product" as const,
                  // Store the ID in text for API submission
                  text: productVariable.id,
                  // Use displayText for UI with product: prefix
                  displayText: `${productVariable.name || token.text}`,
                };
              }
            }

            const matchedProduct = productsData.data.find(
              (product: ProductResponse) =>
                product.title.toLowerCase() === token.text.toLowerCase() ||
                token.text.includes(product.id)
            );

            if (matchedProduct) {
              console.log(
                "Found matching product in API data:",
                matchedProduct
              );
              return {
                ...token,
                type: "product" as const,
                // Store the ID in text for API submission
                text: matchedProduct.id,
                // Use displayText for UI with product: prefix
                displayText: `${matchedProduct.title}`,
              };
            }

            return token;
          });

          console.log("Final processed labor tokens:", laborTokens);

          setLaborFormulaTokens(laborTokens);

          // Immediately save to localStorage instead of waiting for the useEffect
          localStorage.setItem(
            storageKeys.LABOR_KEY,
            JSON.stringify(laborTokens)
          );
        } else {
          setLaborFormulaTokens([]);
        }

        // Initial save to localStorage
        setTimeout(() => {
          saveFormulasToStorage();
        }, 100);
      } else {
        // New element, initialize with proper values
        setDescription("");
        setMarkup(initialMarkup);
        setLocalImage(undefined);
        setMaterialFormulaTokens([]);
        setLaborFormulaTokens([]);

        // Initial save to localStorage
        setTimeout(() => {
          saveFormulasToStorage();
        }, 100);
      }
    } else {
      // Dialog is closing, clear storage
      clearFormulaStorage();
    }

    // Cleanup on unmount
    return () => {
      if (!isOpen) {
        clearFormulaStorage();
      }
    };
  }, [
    isOpen,
    elementToEdit,
    initialName,
    initialMarkup,
    filteredVariables,
    parseFormulaToTokens,
    replaceVariableIdsWithNames,
  ]);

  // Save formulas to localStorage whenever they change
  useEffect(() => {
    if (isOpen) {
      saveFormulasToStorage();
    }
  }, [materialFormulaTokens, laborFormulaTokens, isOpen]);

  // Detect when initialName changes while the dialog is open
  useEffect(() => {
    // Only update if dialog is open and initialName changes
    // But skip this on first render to prevent overwriting elementToEdit name
    if (
      isOpen &&
      !elementToEdit &&
      !initialRenderRef.current &&
      initialName !== ""
    ) {
      setName(initialName);
    }
    initialRenderRef.current = false;
  }, [initialName, isOpen, elementToEdit]);

  // Handle pending variable addition
  useEffect(() => {
    const pendingVariable = pendingVariableRef.current;

    if (pendingVariable.variable && pendingVariable.formulaType) {
      try {
        // Get current formulas from localStorage to ensure we have latest state
        const { materialTokens, laborTokens } = getFormulasFromStorage();

        // Create a token for the new variable
        const newToken: FormulaToken = {
          id: Date.now() + Math.random(),
          text: pendingVariable.variable.name || "",
          type: "variable",
        };

        if (newToken.text) {
          if (pendingVariable.formulaType === "material") {
            // Update material formula with the new variable
            const updatedMaterialTokens = [...materialTokens, newToken];
            setMaterialFormulaTokens(updatedMaterialTokens);

            // Make sure to preserve labor formula
            if (laborTokens.length > 0) {
              setLaborFormulaTokens(laborTokens);
            }
          } else if (pendingVariable.formulaType === "labor") {
            // Update labor formula with the new variable
            const updatedLaborTokens = [...laborTokens, newToken];
            setLaborFormulaTokens(updatedLaborTokens);

            // Make sure to preserve material formula
            if (materialTokens.length > 0) {
              setMaterialFormulaTokens(materialTokens);
            }
          }
        }

        // Reset the pending variable
        pendingVariableRef.current = {
          variable: null,
          formulaType: null,
        };
      } catch (error) {
        console.error("Error adding variable to formula:", error);
      }
    }
  }, [pendingVariableRef.current.variable]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Validate formulas
    if (materialFormulaTokens.length > 0) {
      const materialValidation = validateFormulaTokens(materialFormulaTokens);
      if (!materialValidation.isValid) {
        toast.error("Material formula error", {
          description: materialValidation.error || "Invalid formula",
        });
        return;
      }
    }

    if (laborFormulaTokens.length > 0) {
      const laborValidation = validateFormulaTokens(laborFormulaTokens);
      if (!laborValidation.isValid) {
        toast.error("Labor formula error", {
          description: laborValidation.error || "Invalid formula",
        });
        return;
      }
    }

    const materialFormula = tokensToFormulaString(materialFormulaTokens);
    const laborFormula = tokensToFormulaString(laborFormulaTokens);

    // Log the data that's being submitted
    const payload = {
      name: name.trim(),
      description: description.trim(),
      materialFormula,
      laborFormula,
      markup,
      image: localImage,
    };
    
    console.log(`${elementToEdit ? "Updating" : "Creating"} element with payload:`, {
      ...payload,
      imagePresent: !!localImage,
      imageSize: localImage ? `~${Math.round(localImage.length / 1024)} KB` : 'none',
      materialTokens: materialFormulaTokens,
      laborTokens: laborFormulaTokens,
    });

    // Clear localStorage before submitting
    clearFormulaStorage();

    // Create the final submission payload
    const submissionPayload = {
      name: name.trim(),
      description: description.trim(),
      materialFormula,
      laborFormula,
      markup,
      image: localImage,
    };
    
    // Send the payload to the parent component for API submission
    onSubmit(submissionPayload);
  };

  const handleCreateVariable = (
    variableName: string,
    formulaType?: "material" | "labor"
  ) => {
    if (!onRequestCreateVariable) {
      // Fallback if no callback is provided
      if (updateVariables) {
        // Don't create variable if it's a number
        if (!isNaN(parseFloat(variableName))) return;

        // Check if variable already exists
        const existingVar = variables.find(
          (v) => v.name.toLowerCase() === variableName.toLowerCase()
        );
        if (existingVar) {
          toast.info(`Variable "${variableName}" already exists`);
          return;
        }

        // Skip operators
        if (["+", "-", "*", "/", "(", ")", "^"].includes(variableName)) return;

        // Create temporary variable - make sure we preserve existing variables
        const tempVariable: VariableResponse = {
          id: `temp-${Date.now()}`,
          name: variableName,
          value: 0,
          description: "",
          is_global: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Make sure to use a callback pattern to ensure latest state
        updateVariables((currentVariables: VariableResponse[]) => {
          // Check again that variable doesn't already exist
          if (
            currentVariables.some(
              (v: VariableResponse) =>
                v.name.toLowerCase() === variableName.toLowerCase()
            )
          ) {
            return currentVariables;
          }
          return [...currentVariables, tempVariable];
        });

        // IMPORTANT: Save current formulas to localStorage before setting pending variable
        saveFormulasToStorage();

        // Set the pending variable
        pendingVariableRef.current = {
          variable: tempVariable,
          formulaType: formulaType || null,
        };

        // Force the useEffect to run with a new reference
        pendingVariableRef.current = {
          ...pendingVariableRef.current,
          variable: {
            ...tempVariable,
            updated_at: new Date().getTime().toString(), // Ensure ref changes
          },
        };
      }
      return;
    }

    // Save which formula field is active
    setActiveFormulaField(formulaType || null);

    // IMPORTANT: Save current formulas to localStorage before variable creation
    saveFormulasToStorage();

    // Use the provided callback to create the variable
    onRequestCreateVariable(variableName, (newVariable) => {
      if (!newVariable) {
        console.warn("Variable creation callback returned null or undefined");
        return;
      }

      try {
        if (typeof newVariable === "object" && newVariable.name) {
          // Set the pending variable
          pendingVariableRef.current = {
            variable: newVariable,
            formulaType: formulaType || null,
          };

          // Force the useEffect to run with a new reference
          pendingVariableRef.current = {
            ...pendingVariableRef.current,
            variable: {
              ...newVariable,
              updated_at: new Date().getTime().toString(), // Ensure ref changes
            },
          };
        } else {
          console.error("Invalid variable object structure:", newVariable);
        }
      } catch (error) {
        console.error("Error in variable creation callback:", error);
      }
    });
  };

  // Element validation
  const [elementErrors, setElementErrors] = useState({ name: "" });
  const [elementTouched, setElementTouched] = useState({ name: false });

  useEffect(() => {
    if (elementTouched.name) {
      validateElementForm();
    }
  }, [name, elementTouched.name]);

  const validateElementForm = () => {
    const newErrors = { name: "" };

    if (!name.trim()) {
      newErrors.name = "Element name is required";
    } else if (name.length > 100) {
      newErrors.name = "Element name must be less than 100 characters";
    }

    setElementErrors(newErrors);
    return !newErrors.name;
  };

  const handleElementBlur = (field: string) => {
    setElementTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          clearFormulaStorage();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="w-auto min-w-[600px] max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BracesIcon size={28} className="mr-2" />
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="element-name">
                  Element Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="element-name"
                    placeholder="Wall Framing"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleElementBlur("name")}
                    className={
                      elementErrors.name && elementTouched.name
                        ? "border-red-500 pr-10"
                        : "pr-10"
                    }
                  />
                  {name && (
                    <button
                      type="button"
                      onClick={() => setName("")}
                      className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                      tabIndex={-1}
                      aria-label="Clear element name"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
                {elementErrors.name && elementTouched.name && (
                  <p className="text-xs text-red-500">{elementErrors.name}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="element-description">
                  Description
                  <span className="text-gray-500">&#40;Optional&#41;</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="element-description"
                    placeholder="Description of this element"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] pr-10"
                  />
                  {description && (
                    <button
                      type="button"
                      onClick={() => setDescription("")}
                      className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                      tabIndex={-1}
                      aria-label="Clear description"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Markup Field (only if includeMarkup is true) */}
              {includeMarkup && (
                <div className="grid gap-2">
                  <Label htmlFor="element-markup">Markup Percentage (%)</Label>
                  <Input
                    id="element-markup"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="15"
                    value={markup || ""}
                    onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Enter the percentage markup to apply to this element (e.g., 15
                    for 15%)
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="element-image">
                  Element Image{" "}
                  <span className="text-gray-500">&#40;Optional&#41;</span>
                </Label>

                <div className="h-[200px] w-full relative">
                  {!localImage ? (
                    <div
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={handleFileSelect}
                      className={`absolute inset-0 border-2 border-dashed rounded-lg transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer
                        ${
                          isDragging
                            ? "border-primary/70 bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
                        }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="element-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                          <span className="text-sm font-medium">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center px-4">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground/70" />
                          <p className="text-sm font-medium mb-1">
                            {isDragging
                              ? "Drop to upload"
                              : "Drop image here or click to browse"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or GIF (max. 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <img
                          src={localImage}
                          alt="Element preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", e);
                            // Fallback to a placeholder if the image fails to load
                            e.currentTarget.src = "/placeholder-image.jpg";
                            toast.error("Failed to load image properly");
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-3">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-1.5">
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                              <span className="text-xs font-medium text-white">
                                Image uploaded
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                className="h-6 px-2 bg-black/30 hover:bg-black/50 text-white border-0 rounded-md text-xs font-medium"
                                onClick={handleFileSelect}
                              >
                                Change
                              </button>
                              
                              <button
                                type="button"
                                className="h-6 px-2 bg-black/30 hover:bg-red-600/70 text-white border-0 rounded-md text-xs font-medium flex items-center"
                                onClick={handleRemoveImage}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="element-image-update"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Material Cost Formula */}
          <div className="grid gap-4 max-w-4xl">
            <Label
              htmlFor="material-formula"
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium flex items-center">
                Material Cost Formula
                <span className="text-gray-500">&#40;Optional&#41;</span>
              </span>
              {materialFormulaError && (
                <span className="text-xs text-red-500 font-normal flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />{" "}
                  {materialFormulaError}
                </span>
              )}
            </Label>

            <FormulaBuilder
              formulaTokens={materialFormulaTokens}
              setFormulaTokens={(tokens) => {
                setMaterialFormulaTokens(tokens);
                // Update localStorage immediately
                localStorage.setItem(
                  storageKeys.MATERIAL_KEY,
                  JSON.stringify(tokens)
                );
              }}
              variables={filteredVariables}
              updateVariables={updateVariables}
              hasError={!!materialFormulaError}
              onCreateVariable={(name) => {
                handleCreateVariable(name, "material");
              }}
              formulaType="material"
            />
          </div>


          {/* Labor Cost Formula */}
          <div className="grid gap-4 max-w-4xl">
            <Label
              htmlFor="labor-formula"
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium flex items-center">
                Labor Cost Formula{" "}
                <span className="text-gray-500">&#40;Optional&#41;</span>
              </span>
              {laborFormulaError && (
                <span className="text-xs text-red-500 font-normal flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {laborFormulaError}
                </span>
              )}
            </Label>
           
              <FormulaBuilder
                formulaTokens={laborFormulaTokens}
                setFormulaTokens={(tokens) => {
                  setLaborFormulaTokens(tokens);
                  // Update localStorage immediately
                  localStorage.setItem(
                    storageKeys.LABOR_KEY,
                    JSON.stringify(tokens)
                  );
                }}
                variables={filteredVariables}
                updateVariables={updateVariables}
                hasError={!!laborFormulaError}
                onCreateVariable={(name) => {
                  handleCreateVariable(name, "labor");
                }}
                formulaType="labor"
              />
          </div>

          {/* Markup Field (only if includeMarkup is true) */}
          {includeMarkup && (
            <div className="grid gap-2">
              <Label htmlFor="element-markup">Markup Percentage (%)</Label>
              <Input
                id="element-markup"
                type="number"
                min="0"
                max="100"
                placeholder="15"
                value={markup || ""}
                onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
              />
              <div className="text-xs text-muted-foreground">
                Enter the percentage markup to apply to this element (e.g., 15
                for 15%)
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="justify-end">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              clearFormulaStorage();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full"
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {elementToEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
