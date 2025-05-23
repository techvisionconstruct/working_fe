"use client";

import AddVariableDialog from "@/components/mockup/create-template-page/add-variable-dialog";
import { Input } from "@/components/shared";
import { getProducts } from "@/queryOptions/products";
import { ProductResponse } from "@/types/products/dto";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Test() {
  const [search, setSearch] = React.useState("");
  const { data, isLoading } = useQuery(getProducts(1, 10, search));
  const products = data?.data;
  return (
    <div>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} />

      <ul>
        {products?.map((product: ProductResponse) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}
