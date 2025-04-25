// Define types used across proposal creation components
export interface Template {
  id: number;
  name: string;
  description: string;
  image?: string;
  modules?: Module[];
  parameters?: Parameter[];
}

export interface Module {
  id: number;
  name: string;
  description: string | null;
}

export interface Element {
  id: number;
  name: string;
  description: string | null;
  formula?: string;
  labor_formula?: string;
}

export interface Parameter {
  id: number;
  name: string;
  value: number | string;
  type: string;
}

export interface ElementWithValues {
  element: Element;
  module: Module;
  formula: string;
  labor_formula: string;
  material_cost: number;
  labor_cost: number;
  markup: number;
}

export interface ProposalFormData {
  name: string;
  description: string;
  client_name: string;
  client_email: string;
  phone_number: string;
  address: string;
  image: string;
  selectedModules: Module[];
  selectedParameters: Parameter[];
  selectedElements: ElementWithValues[];
}

export interface TemplateElement {
  name: string;
  description: string;
  formula: string;
  labor_formula: string;
  image: string;
}

export interface template_elements{
  material_cost: string;
  labor_cost: string;
  markup: number;
  element: TemplateElement;
  module: PModule;
}

export interface PModule{
  name: string;
  description: string;
}

export interface ProposalData {
  name: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  image: string;
  template_elements: template_elements[];
  parameters: Parameter[];
}
