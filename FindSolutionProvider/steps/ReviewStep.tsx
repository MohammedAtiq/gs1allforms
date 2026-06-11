"use client";

import { Building2, Check, FileCheck2, Send, Tags, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StepFormFooter, StepFormHeader } from "../components/StepLayout";
import { categoryTitleById } from "../constants/categories";
import type { CompanyProfileValues } from "../schemas/companyProfile";
import { LEGAL_STATUS_OPTIONS, TURNOVER_OPTIONS } from "../schemas/companyProfile";
import type { ContactsValues } from "../schemas/contacts";
import type { DocumentsValues } from "./DocumentsStep";
import type { StepId } from "../types";

interface ReviewStepProps {
  categories?: string[];
  company?: CompanyProfileValues;
  documents?: DocumentsValues;
  contacts?: ContactsValues;
  onBack: () => void;
  onEdit: (step: StepId) => void;
  onProceedToPayment: () => void;
  isSubmitting?: boolean;
}

function turnoverLabel(value?: string): string {
  if (!value?.trim()) return "—";
  return TURNOVER_OPTIONS.find((o) => o.value === value)?.label ?? "—";
}

function legalLabel(value?: string): string {
  if (!value?.trim()) return "—";
  return LEGAL_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? "—";
}

export function ReviewStep({
  categories = [],
  company,
  documents,
  contacts,
  onBack,
  onEdit,
  onProceedToPayment,
  isSubmitting = false,
}: ReviewStepProps) {
  const { t } = useTranslation();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  function handleProceed() {
    if (!consent) {
      setError(t("review.consentRequired"));
      return;
    }
    setError("");
    onProceedToPayment();
  }

  return (
    <div className="flex min-h-[620px] flex-col gap-4">
      <StepFormHeader icon={Send} stepId="review" />

      <p className="text-sm text-slate-500">{t("review.intro")}</p>

      <section className="rounded-xl border border-slate-200 bg-white">
        <header className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <Tags size={14} className="text-gs1-blue" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-700">
            {t("review.selectedCategories")}
          </h3>
        </header>
        <div className="flex flex-wrap gap-2 p-3">
          {categories.length > 0 ? (
            categories.map((id) => (
              <span
                key={id}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {categoryTitleById(id)}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">{t("review.noCategories")}</span>
          )}
        </div>
      </section>

      <InfoSection
        icon={Building2}
        title={t("review.companyBlock")}
        action={
          <button
            type="button"
            onClick={() => onEdit("company")}
            className="text-xs font-semibold text-gs1-orange hover:underline"
          >
            {t("common.edit")}
          </button>
        }
        rows={[
          [t("review.rowNameEn"), company?.companyNameEn ?? ""],
          [t("review.rowCr"), company?.crNumber ?? ""],
          [t("review.rowVat"), company?.vatNumber ?? ""],
          [
            t("review.rowRegionCity"),
            company ? `${company.region} / ${company.city}` : "",
          ],
          [t("review.rowTurnover"), company ? turnoverLabel(company.annualTurnover) : ""],
          [t("review.rowLegal"), company ? legalLabel(company.legalStatus) : ""],
        ]}
      />

      <InfoSection
        icon={User}
        title={t("review.contactBlock")}
        action={
          <button
            type="button"
            onClick={() => onEdit("contacts")}
            className="text-xs font-semibold text-gs1-orange hover:underline"
          >
            {t("common.edit")}
          </button>
        }
        rows={[
          [t("review.rowBilling"), contacts?.billingName ?? ""],
          [t("review.rowBillingEmail"), contacts?.billingEmail ?? ""],
          [t("review.rowHead"), contacts?.headName ?? ""],
        ]}
      />

      <InfoSection
        icon={FileCheck2}
        title={t("review.documentsBlock")}
        action={
          <button
            type="button"
            onClick={() => onEdit("documents")}
            className="text-xs font-semibold text-gs1-orange hover:underline"
          >
            {t("common.edit")}
          </button>
        }
        rows={[
          [t("review.docCr"), documents?.crCertificate ? "Uploaded" : ""],
          [t("review.docVat"), documents?.vatCertificate ? "Uploaded" : ""],
          [t("review.docFin"), documents?.financialStatements ? "Uploaded" : ""],
          [t("review.docPl"), documents?.plStatement ? "Uploaded" : ""],
        ]}
        valueRenderer={(value) =>
          value === "Uploaded" ? (
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <Check size={14} /> Uploaded
            </span>
          ) : (
            <span className="text-slate-400">—</span>
          )
        }
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <label className="flex cursor-pointer gap-3 text-xs leading-relaxed text-slate-700">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setError("");
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-gs1-blue"
          />
          <span>{t("review.consentText")}</span>
        </label>
      </div>
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}

      <StepFormFooter
        active={5}
        showBack
        onBack={onBack}
        primaryLabel={isSubmitting ? t("common.submitting") : t("review.proceedPayment")}
        onPrimaryClick={handleProceed}
        primaryDisabled={isSubmitting}
      />
    </div>
  );
}

function InfoSection({
  icon: Icon,
  title,
  rows,
  action,
  valueRenderer,
}: {
  icon: typeof Building2;
  title: string;
  rows: [string, string][];
  action?: React.ReactNode;
  valueRenderer?: (value: string) => React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gs1-blue" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-700">{title}</h3>
        </div>
        {action}
      </header>
      <div className="divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-2.5 text-xs">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-700">
              {valueRenderer ? valueRenderer(value) : value?.trim() ? value : "—"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
