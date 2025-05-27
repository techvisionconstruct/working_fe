import * as React from "react"

import { cn } from "@/lib/utils"

export function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex justify-center", className)}
      {...props}
    />
  )
}
