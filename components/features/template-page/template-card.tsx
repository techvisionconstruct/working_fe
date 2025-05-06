import { Card, Badge } from "@/components/shared";
import { format } from "date-fns";
import Image from "next/image";
import { TemplateResponse } from "@/types/templates/dto";
import { TemplateOptionsMenu } from "./template-options-menu";

interface TemplateCardProps {
  template: TemplateResponse;
  onEdit?: (template: TemplateResponse) => void;
  onUseInProposal?: (template: TemplateResponse) => void;
  onDelete?: (template: TemplateResponse) => void;
  isDeleting?: boolean;
}

export function TemplateCard({
  template,
  onEdit,
  onUseInProposal,
  onDelete,
  isDeleting = false
}: TemplateCardProps) {
  return (
    <Card className={`flex flex-col p-4 hover:shadow-lg transition-shadow h-full relative ${isDeleting ? 'opacity-70' : ''}`}>
      {isDeleting && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20 rounded-lg">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      <TemplateOptionsMenu
        template={template}
        onEdit={onEdit}
        onUseInProposal={onUseInProposal}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
      
      <div className="flex gap-4">
        <Image
          src={"https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
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
    </Card>
  );
}
