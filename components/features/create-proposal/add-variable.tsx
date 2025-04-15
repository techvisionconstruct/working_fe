import React from "react";
import { PlusCircleIcon } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared";
import { AddParameterProps } from "@/types/create-proposal";

export default function AddVariable({
  newParameter,
  setNewParameter,
  handleAddParameter,
  isDialogOpen,
  setIsDialogOpen,
}: AddParameterProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircleIcon className="h-4 w-4" /> Add Variable
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Parameter</DialogTitle>
          <DialogDescription>
            Create a new parameter to use in your cost calculations
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="parameter-name">Parameter Name</Label>
            <Input
              id="parameter-name"
              value={newParameter.name}
              onChange={(e) =>
                setNewParameter({ ...newParameter, name: e.target.value })
              }
              placeholder="e.g., Room Height"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="parameter-type">Parameter Type</Label>
            <div className="flex gap-2">
              <Select
                value={newParameter.type}
                onValueChange={(value) =>
                  setNewParameter({ ...newParameter, type: value })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Linear Feet">Linear Feet</SelectItem>
                  <SelectItem value="Square Feet">Square Feet</SelectItem>
                  <SelectItem value="Cubic Feet">Cubic Feet</SelectItem>
                  <SelectItem value="Count">Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="parameter-value">Initial Value</Label>
            <Input
              id="parameter-value"
              value={newParameter.value}
              onChange={(e) =>
                setNewParameter({ ...newParameter, value: e.target.value })
              }
              placeholder="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddParameter}>Add Parameter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
