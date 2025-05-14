import { z } from "zod";

export const createTemplateSchema = z.object({
  name: z.string().min(1, { message: "Template name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  trades: z.array(z.string()).min(1, { message: "At least one trade is required" }),
  variables: z.array(z.string()).min(1, { message: "At least one variable is required" })
});

export type CreateTemplateFormData = z.infer<typeof createTemplateSchema>;

export const tradeElementsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    elements: z.array(z.object({ id: z.string() })).min(1, { 
      message: "At least one element is required in a trade" 
    }),
  })
).min(1, { message: "At least one trade with elements is required" });

export const validateTradeElements = (trades: any[]): boolean => {
  const result = tradeElementsSchema.safeParse(trades);
  return result.success;
};
