import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/shared"

interface AlertDestructiveProps {
  title?: string;
  resource?: string;
  message?: string;
}

export function AlertError({
  title = "Error",
  resource = "templates",
  message = "Please try again later."
}: AlertDestructiveProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        Failed to load {resource}. {message}
      </AlertDescription>
    </Alert>
  )
}
