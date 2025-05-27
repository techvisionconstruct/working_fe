"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

export function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}
