import { z } from "zod";

const saMobile = z
  .string()
  .trim()
  .min(1, { message: "Mobile number is required" })
  .regex(/^\+966[0-9]{9}$/, {
    message: "Use format +966 followed by 9 digits (e.g. +966501234567)",
  });

export const companyProfileSchema = z.object({
  companyNameEn: z.string().trim().min(1, { message: "Company name (English) is required" }),
  companyNameAr: z.string().trim().min(1, { message: "Company name (Arabic) is required" }),
  crNumber: z
    .string()
    .trim()
    .min(1, { message: "CR number is required" })
    .regex(/^\d{10}$/, { message: "Enter a valid 10-digit CR number" }),
  vatNumber: z
    .string()
    .trim()
    .min(1, { message: "VAT registration number is required" })
    .regex(/^\d{15}$/, { message: "Enter a valid 15-digit ZATCA VAT number" }),
  corporateEmail: z
    .string()
    .trim()
    .min(1, { message: "Corporate email is required" })
    .email({ message: "Enter a valid email address" }),
  mobile: saMobile,
  address: z.string().trim().min(1, { message: "Registered address is required" }),
  region: z.string().trim().min(1, { message: "Region is required" }),
  city: z.string().trim().min(1, { message: "City is required" }),
  postalCode: z
    .string()
    .trim()
    .min(1, { message: "Postal code is required" })
    .regex(/^\d{5}$/, { message: "Enter a valid 5-digit postal code" }),
  website: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/.*)?$/.test(v),
      { message: "Enter a valid website URL" }
    ),
  yearEstablished: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^\d{4}$/.test(v),
      { message: "Enter a valid 4-digit year" }
    ),
  annualTurnover: z.string().trim().min(1, { message: "Annual turnover is required" }),
  legalStatus: z.string().trim().min(1, { message: "Company legal status is required" }),
  companyDescriptionEn: z.string().trim().optional().or(z.literal("")),
});

export type CompanyProfileValues = z.infer<typeof companyProfileSchema>;

export const companyProfileDefaults: CompanyProfileValues = {
  companyNameEn: "",
  companyNameAr: "",
  crNumber: "",
  vatNumber: "",
  corporateEmail: "",
  mobile: "",
  address: "",
  region: "",
  city: "",
  postalCode: "",
  website: "",
  yearEstablished: "",
  annualTurnover: "",
  legalStatus: "",
  companyDescriptionEn: "",
};

export const SAUDI_REGIONS = [
  "Riyadh",
  "Makkah",
  "Madinah",
  "Eastern Province",
  "Asir",
  "Tabuk",
  "Hail",
  "Northern Borders",
  "Jazan",
  "Najran",
  "Al Bahah",
  "Al Qassim",
  "Jawf",
] as const;

export const TURNOVER_OPTIONS = [
  { value: "under_1m", label: "Under SAR 1 million" },
  { value: "1m_5m", label: "SAR 1 million – 5 million" },
  { value: "5m_20m", label: "SAR 5 million – 20 million" },
  { value: "20m_50m", label: "SAR 20 million – 50 million" },
  { value: "over_50m", label: "Over SAR 50 million" },
];

export const LEGAL_STATUS_OPTIONS = [
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "jsc", label: "Joint Stock Company (JSC)" },
  { value: "branch", label: "Branch of foreign company" },
  { value: "establishment", label: "Establishment" },
  { value: "other", label: "Other" },
];
