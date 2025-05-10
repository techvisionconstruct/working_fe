import { getAllTemplates } from "@/api/templates/get-all-templates";
import { getTemplateById } from "@/api/templates/get-template-by-id";
import { queryOptions } from "@tanstack/react-query";

export function getTemplates() {
  return queryOptions({
    queryKey: ["template"],
    queryFn: () => getAllTemplates(),
  });
}

export function getTemplate(id: string) {
  return queryOptions({
    queryKey: ["template", id],
    queryFn: () => getTemplateById(String(id)),
    select: (data) => data.data,
  });
}
