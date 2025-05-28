import { useMutation } from "@tanstack/react-query";
import { updateElement } from "@/api-calls/elements/update-element";
import { toast } from "sonner";

interface ElementUpdateVariables {
  elementId: string;
  data: any;
}

interface UseElementUpdateMutationOptions {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export const useElementUpdateMutation = (options?: UseElementUpdateMutationOptions) => {
  return useMutation({
    mutationFn: ({ elementId, data }: ElementUpdateVariables) =>
      updateElement(elementId, data),
    onSuccess: (response) => {
      if (options?.onSuccess) {
        options.onSuccess(response);
      } else {
        toast.success("Element updated successfully", {
          position: "top-center",
          description: response?.data?.name ? `"${response.data.name}" has been updated.` : "Element has been updated.",
        });
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      } else {
        toast.error("Failed to update element", {
          position: "top-center",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    },
  });
};
