import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CompanyProfileValues } from "@/FindSolutionProvider/schemas/companyProfile";
import type { ContactsValues } from "@/FindSolutionProvider/schemas/contacts";
import type { DocumentsFiles } from "@/FindSolutionProvider/steps/DocumentsStep";

// ── Call 1: company step ──────────────────────────────────────────────────────
export interface SolutionProviderPayload {
  crNumber: string;
  company: CompanyProfileValues;
  categories: string[];
}

// ── Call 2: review step (only newly added data) ───────────────────────────────
export interface SolutionProviderUpdatePayload {
  crNumber: string;
  contacts: ContactsValues;
  documents?: DocumentsFiles;
  declaration: boolean;
}

const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL ?? "http://20.233.200.211:8001";

function makeUrl(crNumber: string) {
  return `${UPLOAD_BASE_URL}${API_ENDPOINTS.BECOME_SOLUTION_PROVIDER.replace(":crNumber", crNumber)}`;
}

// ── Call 1: POST company + categories ─────────────────────────────────────────
function buildCompanyFormData(payload: SolutionProviderPayload): FormData {
  const { company, categories } = payload;

  const dataJson = {
    company: {
      companyNameEn:        company.companyNameEn,
      companyNameAr:        company.companyNameAr,
      crNumber:             company.crNumber,
      vatNumber:            company.vatNumber,
      corporateEmail:       company.corporateEmail,
      mobile:               company.mobile,
      address:              company.address,
      region:               company.region,
      city:                 company.city,
      postalCode:           company.postalCode,
      website:              company.website ?? "",
      yearEstablished:      company.yearEstablished ?? "",
      annualTurnover:       company.annualTurnover,
      legalStatus:          company.legalStatus,
      companyDescriptionEn: company.companyDescriptionEn ?? "",
      categories,
    },
  };

  const fd = new FormData();
  fd.append("data", JSON.stringify(dataJson));
  return fd;
}

// ── Call 2: POST contacts + documents + declaration ───────────────────────────
function buildUpdateFormData(payload: SolutionProviderUpdatePayload): FormData {
  const { contacts, documents, declaration } = payload;

  const dataJson = {
    contacts: {
      billing: {
        name:   contacts.billingName,
        title:  contacts.billingTitle,
        mobile: contacts.billingMobile,
        email:  contacts.billingEmail,
      },
      companyHead: {
        name:        contacts.headName,
        designation: contacts.headDesignation,
        mobile:      contacts.headMobile,
        email:       contacts.headEmail,
      },
      ...(contacts.techName && {
        technical: {
          name:        contacts.techName,
          designation: contacts.techDesignation ?? "",
          mobile:      contacts.techMobile ?? "",
          email:       contacts.techEmail ?? "",
        },
      }),
    },
    declaration,
  };

  const fd = new FormData();
  fd.append("data", JSON.stringify(dataJson));

  if (documents) {
    if (documents.crCertificate)          fd.append("crCertificate",          documents.crCertificate);
    if (documents.vatCertificate)         fd.append("vatCertificate",         documents.vatCertificate);
    if (documents.financialStatements)    fd.append("financialStatements",    documents.financialStatements);
    if (documents.plStatement)            fd.append("plStatement",            documents.plStatement);
    if (documents.companyProfileBrochure) fd.append("companyProfileBrochure", documents.companyProfileBrochure);
    if (documents.technicalCapability)    fd.append("technicalCapability",    documents.technicalCapability);
  }

  return fd;
}

/** Step 2 — Save & Next: sends company + categories only */
export function useBecomeSolutionProvider() {
  return useMutation({
    mutationFn: (payload: SolutionProviderPayload) =>
      apiService.post(makeUrl(payload.crNumber), buildCompanyFormData(payload), {
        headers: { "Content-Type": undefined },
      }),
  });
}

/** Step 5 — Proceed to Payment: sends contacts + documents + declaration only */
export function useUpdateSolutionProvider() {
  return useMutation({
    mutationFn: (payload: SolutionProviderUpdatePayload) =>
      apiService.post(makeUrl(payload.crNumber), buildUpdateFormData(payload), {
        headers: { "Content-Type": undefined },
      }),
  });
}
