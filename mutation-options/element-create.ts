import { useMutation } from "@tanstack/react-query";
import { createElement } from "@/api/elements/create-element";
import { toast } from "sonner";

interface UseElementCreateMutationOptions {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export const useElementCreateMutation = (options?: UseElementCreateMutationOptions) => {
  return useMutation({
    mutationFn: createElement,
    onSuccess: (response) => {
      if (options?.onSuccess) {
        options.onSuccess(response);
      } else {
        toast.success("Element created successfully", {
          position: "top-center",
          description: response?.data?.name ? `"${response.data.name}" has been created.` : "Element has been created.",
        });
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      } else {
        toast.error("Failed to create element", {
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
