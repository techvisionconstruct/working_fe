import { Card, Badge } from "@/components/shared";
import { format } from "date-fns";
import { Template } from "@/types/templates";
import Image from "next/image";
import Link from "next/link";

interface TemplateGridViewProps {
  templates: Template[];
}

export function TemplateGridView({ templates }: TemplateGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Link href={`/templates/${template.id}`} key={template.id} className="h-full">
          <Card
            className="flex flex-col p-4 hover:shadow-lg transition-shadow h-full"
          >
            <div className="flex gap-4">
              <Image
                src={
                  template.image ||
                  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                }
                width={64}
                height={64}
                alt={template.name}
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
                {template.modules.slice(0, 3).map((module) => (
                  <Badge
                    key={module.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {module.name}
                  </Badge>
                ))}
                {template.modules.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.modules.length - 3} more
                  </Badge>
                )}
              </div>
              {template.parameters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {template.parameters.slice(0, 3).map((param) => (
                    <Badge key={param.id} variant="outline" className="text-xs">
                      {param.name}
                    </Badge>
                  ))}
                  {template.parameters.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.parameters.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-2">
                Updated: {format(new Date(template.updated_at), "MMM d, yyyy")}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
