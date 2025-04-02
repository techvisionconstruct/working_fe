"use client"

import * as React from "react"
import { Button } from "@/components/shared/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shared/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/popover"

export type SortOption = {
  value: string
  label: string
}

const statuses: SortOption[] = [
  {
    value: "name-ascending",
    label: "Name (A-Z)",
  },
  {
    value: "name-descending",
    label: "Name (Z-A)",
  },
  {
    value: "date-ascending",
    label: "Date (Oldest First)",
  },
  {
    value: "date-descending",
    label: "Date (Newest First)",
  },
]

interface SortByComponentProps {
  onChange?: (sortOption: SortOption) => void;
  initialValue?: string;
}

export function SortByComponent({ onChange, initialValue = "name-ascending" }: SortByComponentProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<SortOption | null>(
    initialValue ? statuses.find(status => status.value === initialValue) || null : null
  )

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm text-muted-foreground">Sort by</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className=" justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <> Name (A-Z) </>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      const newSortOption = statuses.find((priority) => priority.value === value) || null;
                      setSelectedStatus(newSortOption);
                      setOpen(false);
                      if (onChange && newSortOption) {
                        onChange(newSortOption);
                      }
                    }}
                  >
                    {status.label}
                  </CommandItem>
                ))}

              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
