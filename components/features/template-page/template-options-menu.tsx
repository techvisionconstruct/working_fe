import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  Button,
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
import { MoreVertical, Edit, Copy, Trash2 } from "lucide-react";
import { TemplateResponse } from "@/types/templates/dto";

interface TemplateOptionsMenuProps {
  template: TemplateResponse;
  onEdit?: (template: TemplateResponse) => void;
  onUseInProposal?: (template: TemplateResponse) => void;
  onDelete?: (template: TemplateResponse) => void;
  isDeleting?: boolean;
}

export function TemplateOptionsMenu({
  template,
  onEdit,
  onUseInProposal,
  onDelete,
  isDeleting = false
}: TemplateOptionsMenuProps) {
  return (
    <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit?.(template)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Template</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUseInProposal?.(template)}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Use in Proposal</span>
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
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
                  onClick={() => onDelete?.(template)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
