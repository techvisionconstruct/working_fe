import { Skeleton } from "@/components/shared";

export function ContractLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-4 w-full max-w-md" />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between my-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden bg-card"
            >
              <div className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              <div className="px-4 py-2">
                <Skeleton className="h-10 w-full" />
                <div className="flex items-center mt-2">
                  <Skeleton className="h-4 w-4 mr-1 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="p-4 pt-2 border-t flex justify-between items-center bg-muted/20">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-1 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
