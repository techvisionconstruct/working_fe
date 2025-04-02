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

type Status = {
  value: string
  label: string
}

const statuses: Status[] = [
  {
    value: "name-ascending",
    label: "Name (A-Z)",
  },
  {
    value: "name-descending",
    label: "Name (Z-A)",
  },
]

export function SortByComponent() {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  )

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm text-muted-foreground">Sort by</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[120px] justify-start">
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
                      setSelectedStatus(
                        statuses.find((priority) => priority.value === value) ||
                          null
                      )
                      setOpen(false)
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
