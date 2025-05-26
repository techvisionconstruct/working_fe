import { getAllTemplates } from "@/api/templates/get-all-templates";
import { getTemplateById } from "@/api/templates/get-template-by-id";
import { queryOptions } from "@tanstack/react-query";

export function getTemplates(page = 1, pageSize = 10, searchQuery?: string) {
  return queryOptions({
    queryKey: ["template", page, pageSize, searchQuery],
    queryFn: () => getAllTemplates(page, pageSize, searchQuery),
  });
}

export function getTemplate(id: string) {
  return queryOptions({
    queryKey: ["template", id],
    queryFn: () => getTemplateById(String(id)),
    select: (data) => data.data,
  });
}
