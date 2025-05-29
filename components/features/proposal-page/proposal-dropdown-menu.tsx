import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/shared";
import { MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface ProposalDropdownMenuProps {
  proposalId: string;
  onDelete?: (proposalId: string) => void;
  isDeleting?: boolean;
}

export function ProposalDropdownMenu({
  proposalId,
  onDelete,
  isDeleting,
}: ProposalDropdownMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete?.(proposalId);
    setIsDialogOpen(false);
  };

  const editUrl = `/proposals/${proposalId}/edit`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-muted"
          aria-label="Proposal actions"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" sideOffset={5}>
        <Link href={editUrl} passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer" disabled={isDeleting}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Proposal
          </DropdownMenuItem>
        </Link>
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onSelect={(e) => e.preventDefault()}
                  disabled={isDeleting}
                  aria-label="Delete proposal"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Proposal
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the proposal and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-700"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
