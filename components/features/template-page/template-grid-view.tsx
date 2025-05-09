import { 
  Card, 
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/shared";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TemplateViewProps } from "@/types/templates/dto";
import { MoreVertical, Edit, Copy, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTemplate } from "@/api/templates/delete-template";
import { toast } from "sonner";

// Consistent default image across the application
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

export function TemplateGridView({ templates }: TemplateViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const originalTemplates = templates.filter((template) => template.origin === "original");
  
  const { mutate: deleteTemplateMutation } = useMutation({
    mutationFn: (templateId: string) => deleteTemplate(templateId),
  
    // Optimistically update the cache before the mutation happens
    onMutate: async (templateId: string) => {
      setDeletingId(templateId);
  
      await queryClient.cancelQueries({ queryKey: ['templates'] });
  
      const previousTemplates = queryClient.getQueryData<any[]>(['templates']);
  
      queryClient.setQueryData(['templates'], (old:any) =>
        old?.filter((template:any) => template.id !== templateId)
      );
  
      return { previousTemplates };
    },

    onError: (error, templateId, context) => {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template. Please try again.');
  
      if (context?.previousTemplates) {
        queryClient.setQueryData(['templates'], context.previousTemplates);
      }
  
      setDeletingId(null);
    },
  
    // Optionally refetch or just clear loading state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setDeletingId(null);
    },
  
    // Show success toast
    onSuccess: () => {
      toast.success('Template deleted successfully');
    },
  });
  
  const handleEdit = (templateId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/templates/${templateId}/edit`);
  };
  
  const handleUseInProposal = (templateId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/proposals/new?templateId=${templateId}`);
  };
  
  const handleDelete = (templateId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTemplateMutation(templateId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {originalTemplates.map((template) => (
        <div key={template.id} className="h-full relative">
          <Card className={`flex flex-col p-4 hover:shadow-lg transition-shadow h-full relative ${deletingId === template.id ? 'opacity-70' : ''}`}>
            {deletingId === template.id && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            {/* Dropdown menu not part of the Link - positioned absolutely */}
            <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => handleEdit(template.id, e)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Template</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleUseInProposal(template.id, e)}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Use in Proposal</span>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onSelect={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Template</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          template and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={(e) => handleDelete(template.id, e)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Link wraps the main card content, but not the dropdown */}
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
