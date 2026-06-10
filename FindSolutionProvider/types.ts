export type StepId =
  | "categories"
  | "company"
  | "documents"
  | "contacts"
  | "review"
  | "payment";

export interface StepDefinition {
  id: StepId;
  index: number;
  title: string;
  subtitle: string;
}

export const STEPS: StepDefinition[] = [
  {
    id: "categories",
    index: 1,
    title: "Barcode Services",
    subtitle: "Select provider categories",
  },
  {
    id: "company",
    index: 2,
    title: "Company",
    subtitle: "Company details",
  },
  {
    id: "documents",
    index: 3,
    title: "Documents",
    subtitle: "Document upload",
  },
  {
    id: "contacts",
    index: 4,
    title: "Contacts",
    subtitle: "Contact details",
  },
  {
    id: "review",
    index: 5,
    title: "Review",
    subtitle: "Review & submit",
  },
];
