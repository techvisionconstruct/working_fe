import { FileText, Layers, File } from "lucide-react";

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export const navItems: NavSection[] = [
  {
    section: "main",
    items: []
  },
  {
    section: "primary",
    items: [
      { icon: File, label: "Templates", href: "/templates" },
      { icon: Layers, label: "Proposals", href: "/proposals" },
      { icon: FileText, label: "Contracts", href: "/contracts" },
    ]
  },
  {
    section: "utility",
    items: []
  }
];

export const SIDEBAR_EXPANDED_WIDTH = "18rem";
export const SIDEBAR_COLLAPSED_WIDTH = "6.5rem";
export const ICON_LEFT_POSITION = "1.75rem";
