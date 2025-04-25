import { z } from "zod";

// Define schemas for each component of the form
export const elementSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional().default(""),
  created_at: z.string().optional(),
  formula: z.string().optional(),
  labor_formula: z.string().optional(),
  updated_at: z.string().optional(),
});

export const moduleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional().default(""),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const parameterSchema = z.object({
  id: z.number(),
  name: z.string(),
  value: z.union([z.string(), z.number()]),
  type: z.string(),
});

export const elementWithValuesSchema = z.object({
  id: z.number(),
  element: elementSchema,
  module: moduleSchema,
  formula: z.string(),
  labor_formula: z.string(),
  material_cost: z.number().default(0),
  labor_cost: z.number().default(0),
  markup: z.number().default(10),
});

// Define the template element schema
export const templateElementSchema = z.object({
  id: z.number(),
  element: elementSchema,
  material_cost: z.number().optional(),
  labor_cost: z.number().optional(),
  image: z.string().optional(),
  module: moduleSchema,
  markup: z.number().optional(),
});

export const templateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  modules: z.array(moduleSchema).optional(),
  parameters: z.array(parameterSchema).optional(),
  template_elements: z.array(templateElementSchema).optional(),
});

// Main proposal form schema
export const proposalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  client_name: z.string().min(1, "Client name is required"),
  client_email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  image: z.string().url("Invalid image URL"),
  selectedTemplate: z.any().optional(),
  selectedModules: z
    .array(moduleSchema)
    .min(1, "At least one module must be selected"),
  selectedParameters: z
    .array(parameterSchema)
    .min(1, "At least one parameter must be selected"),
  selectedElements: z
    .array(elementWithValuesSchema)
    .min(1, "At least one element must be selected"),
});

export type Template = z.infer<typeof templateSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Element = z.infer<typeof elementSchema>;
export type Parameter = z.infer<typeof parameterSchema>;
export type ElementWithValues = z.infer<typeof elementWithValuesSchema>;
export type TemplateElement = z.infer<typeof templateElementSchema>;
export type ProposalFormData = z.infer<typeof proposalFormSchema>;

export function validateProposalForm(data: ProposalFormData) {
  const parseResult = proposalFormSchema.safeParse(data);

  if (parseResult.success) {
    // Create a submission schema that excludes the selectedTemplate field
    const submissionSchema = proposalFormSchema.transform(
      ({ selectedTemplate, ...rest }) => rest
    );

    // Parse with the submission schema to get the final data structure without selectedTemplate
    return submissionSchema.safeParse(data);
  }

  // Return the original validation error
  return parseResult;
}

// Validate individual sections
export function validateProposalDetails(
  data: Pick<
    ProposalFormData,
    | "name"
    | "description"
    | "client_name"
    | "client_email"
    | "phone_number"
    | "address"
    | "image"
  >
) {
  return proposalFormSchema
    .pick({
      name: true,
      description: true,
      client_name: true,
      client_email: true,
      phone_number: true,
      address: true,
      image: true,
    })
    .safeParse(data);
}
