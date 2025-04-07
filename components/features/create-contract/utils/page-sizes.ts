import { PageSize } from "./types";

interface PageDimensions {
  width: number;
  height: number;
}

export const getPageDimensions = (pageSize: PageSize): PageDimensions => {
  switch (pageSize) {
    case "a4":
      return { width: 595, height: 842 }; // A4 in pixels at 72 DPI
    case "letter":
      return { width: 612, height: 792 }; // Letter in pixels at 72 DPI
    case "legal":
      return { width: 612, height: 1008 }; // Legal in pixels at 72 DPI
    case "short":
      return { width: 595, height: 700 }; // Custom short format
    default:
      return { width: 595, height: 842 }; // Default to A4
  }
};

// Fix: Use 'export type' instead of just 'export' for re-exporting types
export type { PageSize };
