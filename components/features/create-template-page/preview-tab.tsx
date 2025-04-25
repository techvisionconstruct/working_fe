import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, Form } from "@/components/shared";
import {
  ModuleForm,
  ParameterForm,
  previewSchema,
  TemplateDetailsForm,
} from "./zod-schema";
import React, { useState } from "react";
import {
  AlertCircle,
  Check,
  ArrowLeft,
  FileText,
  Package,
  Ruler,
} from "lucide-react";

export function PreviewTab({
  templateDetails,
  parameters,
  modules,
  onSubmit,
  isSubmitting: externalIsSubmitting,
}: {
  templateDetails: TemplateDetailsForm;
  parameters: ParameterForm;
  modules: ModuleForm;
  onSubmit: () => void;
  isSubmitting?: boolean;
}) {
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const isSubmitting = externalIsSubmitting || localIsSubmitting;

  const form = useForm<any>({
    resolver: zodResolver(previewSchema),
    defaultValues: {
      name: templateDetails.name,
      description: templateDetails.description,
      image: templateDetails.image,
      parameters,
      modules,
    },
    values: {
      name: templateDetails.name,
      description: templateDetails.description,
      image: templateDetails.image,
      parameters,
      modules,
    },
  });

  function handleSubmit() {
    setLocalIsSubmitting(true);
    form.trigger().then((valid) => {
      if (valid) onSubmit();
      setLocalIsSubmitting(false);
    });
  }

  return (
    <Form {...form}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Preview Template
          </h2>
          <p className="text-sm text-muted-foreground">
            Review your template details before submitting. Make sure everything
            looks correct.
          </p>
        </div>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Card className="overflow-hidden shadow-sm border">
            <CardContent className="p-0">
              {templateDetails.image && (
                <div className="relative h-48 md:h-64 w-full overflow-hidden">
                  <img
                    src={
                      typeof templateDetails.image === "string"
                        ? templateDetails.image
                        : URL.createObjectURL(templateDetails.image)
                    }
                    alt="Template"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-3xl font-bold tracking-tight">
                  {templateDetails.name || "Untitled Template"}
                </h2>

                {form.formState.errors.name && (
                  <div className="text-destructive flex items-center gap-1 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {typeof form.formState.errors.name?.message === "string"
                      ? form.formState.errors.name.message
                      : "Name is required"}
                  </div>
                )}

                <p className="text-muted-foreground mt-2">
                  {templateDetails.description || "No description provided."}
                </p>

                {form.formState.errors.description && (
                  <div className="text-destructive flex items-center gap-1 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {typeof form.formState.errors.description?.message ===
                    "string"
                      ? form.formState.errors.description.message
                      : "Description is required"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {parameters.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Parameters</h3>
              </div>

              {form.formState.errors.parameters && (
                <div className="text-destructive flex items-center gap-1 text-sm p-3 bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {typeof form.formState.errors.parameters?.message === "string"
                    ? form.formState.errors.parameters.message
                    : "At least one parameter is required"}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {parameters.map((param) => (
                  <Card key={param.id} className="overflow-hidden bg-card">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="font-medium">{param.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Type: {param.type}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {modules.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Modules</h3>
              </div>

              {form.formState.errors.modules && (
                <div className="text-destructive flex items-center gap-1 text-sm p-3 bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {typeof form.formState.errors.modules?.message === "string"
                    ? form.formState.errors.modules.message
                    : "At least one module is required"}
                </div>
              )}

              <div className="space-y-4">
                {modules.map((module) => (
                  <Card key={module.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-3 rounded-md">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-base">
                              {module.name}
                            </h4>
                            {module.elements && (
                              <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium">
                                {module.elements.length}{" "}
                                {module.elements.length === 1
                                  ? "element"
                                  : "elements"}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                        </div>
                      </div>

                      {/* Elements section */}
                      {module.elements && module.elements.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center gap-1 text-sm font-medium mb-2">
                            <FileText className="h-4 w-4" />
                            <span>Elements</span>
                          </div>
                          <div className="grid gap-3">
                            {module.elements.map((el) => (
                              <div
                                key={el.id}
                                className="p-3 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-sm">
                                    {el.name}
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {el.description}
                                </div>

                                {(el.formula || el.labor_formula) && (
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {el.formula && (
                                      <div className="text-xs bg-background/80 p-2 rounded border">
                                        <span className="block font-medium mb-1">
                                          Formula
                                        </span>
                                        <code className="text-primary">
                                          {el.formula}
                                        </code>
                                      </div>
                                    )}
                                    {el.labor_formula && (
                                      <div className="text-xs bg-background/80 p-2 rounded border">
                                        <span className="block font-medium mb-1">
                                          Labor Formula
                                        </span>
                                        <code className="text-primary">
                                          {el.labor_formula}
                                        </code>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {el.markup && (
                                  <div className="mt-2 text-xs bg-background/80 p-2 rounded border">
                                    <span className="block font-medium mb-1">
                                      Markup
                                    </span>
                                    <code className="text-primary">
                                      {el.markup}
                                    </code>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!module.elements || module.elements.length === 0) && (
                        <div className="mt-4">
                          <div className="flex items-center gap-1 text-sm font-medium mb-2">
                            <FileText className="h-4 w-4" />
                            <span>Elements</span>
                          </div>
                          <div className="text-xs text-muted-foreground p-3 bg-muted/40 rounded-md">
                            No elements in this module
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {form.formState.errors.elements && (
            <div className="text-destructive flex items-center gap-1 text-sm p-3 bg-destructive/10 rounded-md">
              <AlertCircle className="w-4 h-4" />
              {typeof form.formState.errors.elements?.message === "string"
                ? form.formState.errors.elements.message
                : "Each module must have at least one element"}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="submit"
              className="px-6"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Template"}
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
