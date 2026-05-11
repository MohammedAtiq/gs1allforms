export interface ProviderCategoryDef {
  id: string;
  title: string;
  description: string;
  /** Annual fee in SAR (before VAT) */
  feeSar: number;
}

/** Order: column 1 top-to-bottom, then column 2 (matches reference layout). */
export const PROVIDER_CATEGORIES: ProviderCategoryDef[] = [
  {
    id: "barcode",
    title: "Barcode Solution Provider",
    description: "Barcode generation software, labels, readers, printers.",
    feeSar: 2200,
  },
  {
    id: "online_printing",
    title: "Online Printing Solution Provider",
    description: "Variable data printing on product packaging.",
    feeSar: 2000,
  },
  {
    id: "retail_pos",
    title: "Retail Software / POS Provider",
    description: "Point-of-sale and retail management systems.",
    feeSar: 2000,
  },
  {
    id: "epc_rfid",
    title: "EPC RFID Solution Provider",
    description: "RFID readers, antennas, printers & tags.",
    feeSar: 2500,
  },
  {
    id: "gs1_digital_link",
    title: "GS1 Digital Link Provider",
    description: "2D barcode and QR code enriched journeys.",
    feeSar: 1800,
  },
  {
    id: "authentication",
    title: "Authentication Solution Provider",
    description: "Track & trace and anti-counterfeit solutions.",
    feeSar: 3900,
  },
  {
    id: "system_integrator",
    title: "System Integrator",
    description: "Turnkey hardware & software GS1 solutions.",
    feeSar: 3000,
  },
  {
    id: "packaging",
    title: "Packaging Solution Provider",
    description: "Custom packaging design, manufacture & supply.",
    feeSar: 1500,
  },
  {
    id: "images_ecatalog",
    title: "Images / E-Cataloguing Provider",
    description: "Product attribute capture and data pools.",
    feeSar: 1600,
  },
  {
    id: "others",
    title: "Others",
    description: "Any other GS1-aligned solution or service.",
    feeSar: 1000,
  },
];

export function categoryTitleById(id: string): string {
  return PROVIDER_CATEGORIES.find((c) => c.id === id)?.title ?? id;
}

export function feesForCategoryIds(ids: string[]): number {
  return ids.reduce((sum, id) => {
    const def = PROVIDER_CATEGORIES.find((c) => c.id === id);
    return sum + (def?.feeSar ?? 0);
  }, 0);
}
