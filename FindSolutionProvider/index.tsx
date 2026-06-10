"use client";

import { useMemo, useState } from "react";

import { PageFooter } from "./components/PageFooter";
import { PageHeader } from "./components/PageHeader";
import { MobileStepCard } from "./components/MobileStepCard";
import { Sidebar } from "./components/Sidebar";
import { SubmissionSuccess } from "./components/SubmissionSuccess";
import { LanguageProvider } from "./providers/LanguageProvider";
import { CategoryStep } from "./steps/CategoryStep";
import { CompanyDetailsStep } from "./steps/CompanyDetailsStep";
import { ContactsStep } from "./steps/ContactsStep";
import { DocumentsStep, type DocumentsValues } from "./steps/DocumentsStep";
import { PaymentStep, type PaymentValues } from "./steps/PaymentStep";
import { ReviewStep } from "./steps/ReviewStep";
import type { CompanyProfileValues } from "./schemas/companyProfile";
import type { ContactsValues } from "./schemas/contacts";
import { STEPS, type StepId } from "./types";
import { useBecomeSolutionProvider } from "@/services/formService";

interface FormData {
  categories?: string[];
  company?: CompanyProfileValues;
  documents?: DocumentsValues;
  contacts?: ContactsValues;
  reviewConsent?: boolean;
  payment?: PaymentValues;
}

export default function FindSolutionProvider() {
  return (
    <LanguageProvider>
      <FindSolutionProviderContent />
    </LanguageProvider>
  );
}

function FindSolutionProviderContent() {
  const [currentStep, setCurrentStep] = useState<StepId>("categories");
  const [data, setData] = useState<FormData>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const { mutateAsync: submitToApi, isPending: isApiPending } = useBecomeSolutionProvider();

  const completedPercent = useMemo(() => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    const safe = idx < 0 ? 0 : idx;
    return Math.round(((safe + 1) / STEPS.length) * 100);
  }, [currentStep]);

  const completedStepIds = useMemo(() => {
    const ids: StepId[] = [];
    if (data.categories?.length) ids.push("categories");
    if (data.company) ids.push("company");
    if (data.documents) ids.push("documents");
    if (data.contacts) ids.push("contacts");
    if (data.reviewConsent) ids.push("review");
    if (data.payment) ids.push("payment");
    return ids;
  }, [data]);

  function handleCategoriesSubmit(values: string[]) {
    setData((prev) => ({ ...prev, categories: values }));
    setCurrentStep("company");
  }

  async function handleCompanySubmit(values: CompanyProfileValues) {
    setApiError("");
    // Save data and navigate immediately — API call runs in background
    setData((prev) => ({ ...prev, company: values }));
    setCurrentStep("documents");
    try {
      await submitToApi({
        crNumber:   values.crNumber,
        company:    values,
        categories: data.categories ?? [],
      });
    } catch (err) {
      console.error("Company submit API error:", err);
    }
  }

  function handleDocumentsSubmit(values: DocumentsValues) {
    setData((prev) => ({ ...prev, documents: values }));
    setCurrentStep("contacts");
  }

  function handleContactsSubmit(values: ContactsValues) {
    setData((prev) => ({ ...prev, contacts: values }));
    setCurrentStep("review");
  }

  async function handleProceedToPayment() {
    if (!data.company) return;
    setApiError("");
    // Navigate immediately — API call runs in background
    setData((prev) => ({ ...prev, reviewConsent: true }));
    setCurrentStep("payment");
    try {
      await submitToApi({
        crNumber:    data.company.crNumber,
        company:     data.company,
        categories:  data.categories ?? [],
        contacts:    data.contacts,
        documents:   data.documents?._files as import("@/FindSolutionProvider/steps/DocumentsStep").DocumentsFiles,
        declaration: true,
      });
    } catch (err) {
      console.error("Review submit API error:", err);
    }
  }

  function handlePaymentSubmit(payment: PaymentValues) {
    setData((prev) => {
      const payload: FormData = { ...prev, payment };
      console.log("GS1 Authorised Solution Provider — full application payload:", payload);
      return payload;
    });
    setIsSubmitted(true);
  }

  function handleBackToHome() {
    setCurrentStep("categories");
    setData({});
    setIsSubmitted(false);
  }

  const selectedCategories = data.categories ?? [];

  return (
    <div className="flex min-h-full flex-col bg-gs1-surface">
      <PageHeader />

      {isSubmitted ? (
        <SubmissionSuccess
          applicantName={data.contacts?.billingName}
          companyName={data.company?.companyNameEn}
          categoryCount={selectedCategories.length}
          payment={data.payment}
          onBackToHome={handleBackToHome}
        />
      ) : (
        <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <Sidebar
              currentStep={currentStep}
              completedPercent={completedPercent}
              completedStepIds={completedStepIds}
            />

            <div className="flex flex-1 flex-col gap-4">
              <MobileStepCard currentStep={currentStep} />

              {apiError ? (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {apiError}
                </p>
              ) : null}

              <section className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                {currentStep === "categories" ? (
                  <CategoryStep
                    defaultSelected={data.categories}
                    onSubmit={handleCategoriesSubmit}
                  />
                ) : currentStep === "company" ? (
                  <CompanyDetailsStep
                    defaultValues={data.company}
                    onBack={() => setCurrentStep("categories")}
                    onSubmit={handleCompanySubmit}
                    isSubmitting={isApiPending}
                  />
                ) : currentStep === "documents" ? (
                  <DocumentsStep
                    defaultValues={data.documents}
                    onBack={() => setCurrentStep("company")}
                    onSubmit={handleDocumentsSubmit}
                  />
                ) : currentStep === "contacts" ? (
                  <ContactsStep
                    defaultValues={data.contacts}
                    onBack={() => setCurrentStep("documents")}
                    onSubmit={handleContactsSubmit}
                  />
                ) : currentStep === "review" ? (
                  <ReviewStep
                    categories={data.categories}
                    company={data.company}
                    documents={data.documents}
                    contacts={data.contacts}
                    onBack={() => setCurrentStep("contacts")}
                    onEdit={(step) => setCurrentStep(step)}
                    onProceedToPayment={handleProceedToPayment}
                    isSubmitting={isApiPending}
                  />
                ) : currentStep === "payment" ? (
                  <PaymentStep
                    selectedCategoryIds={selectedCategories}
                    onBack={() => setCurrentStep("review")}
                    onSubmitPay={handlePaymentSubmit}
                  />
                ) : null}
              </section>
            </div>
          </div>
        </div>
      )}

      <PageFooter />
    </div>
  );
}
