import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CompanyProfileValues } from "@/FindSolutionProvider/schemas/companyProfile";
import type { ContactsValues } from "@/FindSolutionProvider/schemas/contacts";
import type { DocumentsFiles } from "@/FindSolutionProvider/steps/DocumentsStep";

export interface SolutionProviderPayload {
  crNumber: string;
  company: CompanyProfileValues;
  categories: string[];
  contacts?: ContactsValues;
  documents?: DocumentsFiles;
  declaration?: boolean;
}

function buildFormData(payload: SolutionProviderPayload): FormData {
  const { company, categories, contacts, documents, declaration } = payload;

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
    ...(contacts && {
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
    }),
    ...(declaration !== undefined && { declaration }),
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

/**
 * POST /become_solution_provider/{crNumber}
 *
 * Called twice:
 *  1. Step 2 — Save & Next  → company + categories only (no files)
 *  2. Step 5 — Proceed to Payment → full payload with files + declaration
 */
export function useBecomeSolutionProvider() {
  return useMutation({
    mutationFn: (payload: SolutionProviderPayload) => {
      const url = API_ENDPOINTS.BECOME_SOLUTION_PROVIDER.replace(
        ":crNumber",
        payload.crNumber
      );
      const fd = buildFormData(payload);
      return apiService.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
}
