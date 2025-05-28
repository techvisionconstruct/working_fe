import { 
  Card, 
  Badge
} from "@/components/shared";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { TemplateViewProps } from "@/types/templates/dto";
import { UseMutateFunction } from "@tanstack/react-query";
import { TemplateDropdownMenu } from "./template-dropdown-menu";
import { toast } from "sonner";

// Consistent default image across the application
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

interface TemplateGridViewProps extends TemplateViewProps {
  onDeleteTemplate: (templateId: string) => void;
  isDeleting?: boolean;
}

export function TemplateGridView({ templates, onDeleteTemplate, isDeleting }: TemplateGridViewProps) {

  const originalTemplates = templates.filter((template) => template.origin === "original");
  
  const handleDelete = (templateId: string) => {
    onDeleteTemplate(templateId);
  };

  if (originalTemplates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" strokeWidth={1} />
        <h3 className="text-lg font-medium">No templates found</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          You haven't created any templates yet or none match your search.
        </p>
        <Link
          href="/templates/create"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90"
        >
          Create Your First Template
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{originalTemplates.map((template) => (
        <div key={template.id} className="h-full relative">
          <Card className={`flex flex-col p-4 hover:shadow-lg transition-shadow h-full relative `}>            <div className="absolute top-2 right-2 z-10">
              <TemplateDropdownMenu 
                templateId={template.id} 
                onDelete={handleDelete} 
                isDeleting={isDeleting}
              />
            </div>
            <Link 
              href={`/templates/${template.id}`}
              className="flex flex-col h-full"
            >
              <div className="flex gap-4">
                <Image
                  src={template.image || DEFAULT_IMAGE}
                  width={64}
                  height={64}
                  alt={`${template.name} thumbnail`}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-auto pt-4">
                <div className="flex flex-wrap gap-2">
                  {template.trades?.slice(0, 3).map((trade) => (
                    <Badge key={trade.id} variant="secondary" className="text-xs">
                      {trade.name}
                    </Badge>
                  ))}
                  {template.trades && template.trades.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.trades.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.variables?.slice(0, 3).map((variable) => (
                    <Badge
                      key={variable.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {variable.name}
                    </Badge>
                  ))}
                  {template.variables && template.variables.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.variables.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Updated: {format(new Date(template.updated_at), "MMM d, yyyy")}
                </div>
              </div>
            </Link>
          </Card>
        </div>
      ))}
    </div>
  );
}
