import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  Input,
  Textarea,
  Button,
} from "@/components/shared";
import { TemplateDetailsForm } from "./zod-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateDetailsSchema } from "./zod-schema";
import React from "react";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/shared/file-upload/file-upload";
import { CloudUpload, X, ArrowRight } from "lucide-react";

export function TemplateDetailsTab({
  value,
  onChange,
  onNext,
}: {
  value: TemplateDetailsForm;
  onChange: (data: TemplateDetailsForm) => void;
  onNext: () => void;
}) {

  const form = useForm<TemplateDetailsForm>({
    resolver: zodResolver(templateDetailsSchema),
    defaultValues: value,
    values: value,
  });

  React.useEffect(() => {
    form.reset(value);
  }, [value]);

  async function handleNext() {
    const valid = await form.trigger();
    if (valid) {
      onChange(form.getValues());
      onNext();
    }
  }

  const handleFieldChange = React.useCallback(() => {
    onChange(form.getValues());
  }, [form, onChange]);

  return (
    <Form {...form}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Template Details</h2>
          <p className="text-sm text-muted-foreground">
            Provide basic information about your template to help users understand its purpose.
          </p>
        </div>
        
        <form
          className="space-y-8"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleNext();
          }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Template Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter template name"
                        className="w-full"
                        onBlur={() => { field.onBlur(); handleFieldChange(); }}
                        onChange={e => { field.onChange(e); handleFieldChange(); }}
                      />
                    </FormControl>
                    <FormDescription>A clear, descriptive name for your template</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe what this template is for..."
                        className="min-h-40 resize-y"
                        onBlur={() => { field.onBlur(); handleFieldChange(); }}
                        onChange={e => { field.onChange(e); handleFieldChange(); }}
                      />
                    </FormControl>
                    <FormDescription>Explain the purpose and benefits of this template</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="h-full">
                    <FormLabel className="text-base">Template Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value ? [field.value] : []}
                        onValueChange={files => {
                          field.onChange(files[0]);
                          handleFieldChange();
                        }}
                        accept="image/*"
                        maxFiles={1}
                        maxSize={5 * 1024 * 1024}
                        onFileReject={(_, message) => {
                          form.setError("image", { message });
                        }}
                        className="h-full"
                      >
                        <FileUploadDropzone className="flex-col border-2 border-dashed h-64 flex items-center justify-center bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                          <CloudUpload className="w-12 h-12 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-base font-medium text-muted-foreground">
                            Drag and drop or
                          </p>
                          <FileUploadTrigger asChild>
                            <Button variant="outline" size="sm" className="mb-2">
                              Choose file
                            </Button>
                          </FileUploadTrigger>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or GIF (max. 5MB)
                          </p>
                        </FileUploadDropzone>
                        <FileUploadList>
                          {field.value && (
                            <FileUploadItem value={field.value}>
                              <div className="relative h-64 w-full overflow-hidden rounded-lg border">
                                <FileUploadItemPreview className="h-full w-full object-cover" />
                                <FileUploadItemDelete asChild className="absolute top-2 right-2">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full shadow-md"
                                    onClick={() => {
                                      field.onChange(undefined);
                                      handleFieldChange();
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </FileUploadItemDelete>
                              </div>
                              <FileUploadItemMetadata className="sr-only" />
                            </FileUploadItem>
                          )}
                        </FileUploadList>
                      </FileUpload>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              id="template-details-next" 
              type="submit"
              className="px-8 font-medium"
              size="lg"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
