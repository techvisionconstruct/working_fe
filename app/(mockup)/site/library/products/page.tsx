"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, Button } from "@/components/shared";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/queryOptions/products";
import { ProductResponse } from "@/types/products/dto";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared";
import { SearchComponent } from "@/components/shared/ui/search-component";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isPending } = useQuery(
    getProducts(currentPage, pageSize, searchQuery)
  );

  const products = data?.data;
  const paginationMeta = data?.meta;
  const paginationLinks = data?.links;

  const pathname = usePathname();
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    if (
      newPage >= 1 &&
      (!paginationMeta || newPage <= paginationMeta.total_pages)
    ) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (price === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  };

  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Browse and search products from your library.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <SearchComponent
            className="rounded-full"
            onChange={handleSearch}
            value={searchQuery}
          />
        </div>

        <div className="border rounded-2xl px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products && products.length > 0 ? (
                products.map((product: ProductResponse) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-[60px] h-[60px]">
                        <img
                          src={product.primary_image}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.title}
                    </TableCell>
                    <TableCell>{product.source_platform}</TableCell>
                    <TableCell>
                      {product.rating ? (
                        <div className="flex items-center">
                          <span>{product.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.ratings_total || 0})
                          </span>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {formatPrice(product.price, product.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => window.open(product.link, "_blank")}
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {paginationMeta && paginationMeta.total_pages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {(paginationMeta.current_page - 1) * paginationMeta.page_size + 1}{" "}
              to{" "}
              {Math.min(
                paginationMeta.current_page * paginationMeta.page_size,
                paginationMeta.total_count
              )}{" "}
              of {paginationMeta.total_count} products
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isPending}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isPending}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                Page {paginationMeta.current_page} of{" "}
                {paginationMeta.total_pages}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === paginationMeta.total_pages || isPending
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => handlePageChange(paginationMeta.total_pages)}
                disabled={
                  currentPage === paginationMeta.total_pages || isPending
                }
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
