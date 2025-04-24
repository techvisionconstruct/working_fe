import { useMemo } from "react";
import Image from "next/image";
import { Card, CardContent, Badge } from "@/components/shared";
import Link from "next/link";

import { getTemplates } from "@/hooks/api/templates/get-templates";
import { GridLoader } from "@/components/loader/grid-loader";
import { ContractProps } from "@/types/contracts";
import { getContracts } from "@/hooks/api/contracts/get-contracts";

export default function ContractGridView({
  sortOption,
  searchQuery = "",
}: ContractProps) {
  const { contracts, isLoading, error } = getContracts();

  const filteredAndSortedContracts = useMemo(() => {
    if (!contracts) return [];

    const filtered = searchQuery
      ? contracts.filter(
          (contracts) =>
            contracts.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contracts.contractDescription
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : contracts;

    return [...filtered].sort((a, b) => {
      if (sortOption.value === "name-ascending") {
        return a.contractName.localeCompare(b.contractName);
      } else if (sortOption.value === "name-descending") {
        return b.contractName.localeCompare(a.contractName);
      } else if (sortOption.value === "date-ascending") {
        return (
          new Date(a.contractDate).getTime() - new Date(b.contractDate).getTime()
        );
      } else if (sortOption.value === "date-descending") {
        return (
          new Date(b.contractDate).getTime() - new Date(a.contractDate).getTime()
        );
      }
      return 0;
    });
  }, [sortOption, searchQuery, contracts]);

  if (isLoading) {
    return <GridLoader />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedContracts.length > 0 ? (
        filteredAndSortedContracts.map((contract) => (
          <Link
            key={contract.uuid}
            href={`contracts/${contract.uuid}`}
            className="group"
          >
            <Card
              className="h-full rounded-2xl overflow-hidden transition-all duration-200 shadow-none group-hover:shadow-xl group-hover:-translate-y-1 border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm cursor-pointer"
            >
              <div className="w-full h-40 relative bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={contract.image || "/placeholder-image.jpg"}
                  alt={contract.contractName}
                  fill
                  className="object-cover"
                  style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
                />
              </div>
              <CardContent className="p-5">
                <h1 className="text-lg font-semibold mb-1 text-zinc-900 dark:text-zinc-100 truncate">
                  {contract.contractName}
                </h1>
                <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 min-h-[48px]">
                  {contract.contractDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {contract.contractModules &&
                    contract.contractModules.slice(0, 4).map((module, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="font-semibold uppercase text-xs rounded-lg border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-2 py-0.5"
                      >
                        {module.name || "Module"}
                      </Badge>
                    ))}
                  {contract.contractModules && contract.contractModules.length > 4 && (
                    <Badge
                      variant="outline"
                      className="font-semibold uppercase text-xs rounded-lg border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-2 py-0.5"
                    >
                      +{contract.contractModules.length - 4} more
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 rounded-lg border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-2 py-0.5"
                  >
                    <span className="uppercase font-semibold">Parameters</span>
                    <span className="ml-1 h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 text-xs text-zinc-700 dark:text-zinc-200 flex items-center justify-center px-1">
                      {contract.parameters?.length || 0}
                    </span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 rounded-lg border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-2 py-0.5"
                  >
                    <span className="uppercase font-semibold">Modules</span>
                    <span className="ml-1 h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 text-xs text-zinc-700 dark:text-zinc-200 flex items-center justify-center px-1">
                      {contract.contractModules?.length || 0}
                    </span>
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs font-medium text-zinc-400">
                    {new Date(contract.contractDate).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <div className="col-span-3 py-8 text-center">
          <p className="text-lg font-medium text-zinc-400">
            No contract found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}


