"use client";

import {
  BadgeCheck,
  Building2,
  CreditCard,
  FileCheck2,
  Send,
  SendHorizontal,
  ShieldCheck,
  Tags,
} from "lucide-react";
import { useMemo } from "react";
import type { CompanyInfoValues } from "../schemas/companyInfo";
import type { DeclarationValues } from "./DeclarationStep";
import type { DocumentsValues } from "./DocumentsStep";
import type { FeesValues } from "./FeesStep";

interface ReviewStepProps {
  company?: CompanyInfoValues;
  category?: string[];
  documents?: DocumentsValues;
  fees?: FeesValues;
  declaration?: DeclarationValues;
  onBack: () => void;
  onSubmitApplication: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  barcode: "Barcode Solution Provider",
  auth: "Authentication Solution Provider",
  printing: "Online Printing Solution Provider",
  integrator: "System Integrators",
  retail: "Retail Software Solution Provider",
  packaging: "Packaging",
  rfid: "RFID Solution Provider",
  catalog: "Images, Dimensions & e-Cataloguing",
};

const PAYMENT_MODE_LABELS: Record<FeesValues["paymentMode"], string> = {
  online: "Online Payment (Card / Mada / Net Banking)",
  dd: "Demand Draft (DD / Pay Order)",
  neft: "NEFT (Bank Transfer)",
};

export function ReviewStep({
  company,
  category,
  documents,
  fees,
  declaration,
  onBack,
  onSubmitApplication,
}: ReviewStepProps) {
  const categoryLabels = useMemo(
    () => (category?.length ? category.map((id) => CATEGORY_LABELS[id] ?? id) : []),
    [category],
  );

  return (
    <div className="flex min-h-[620px] flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-gs1-blue">
            <Send size={16} strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-gs1-blue">Review & Submit</h2>
            <p className="text-xs text-slate-500">Final review & submit</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200 sm:px-3 sm:text-[11px]">
          Step 6 of 6
        </span>
      </header>

      <InfoSection
        icon={Building2}
        title="Company Details"
        rows={[
          ["Company", company?.companyName || "—"],
          ["Contact", company?.contactPerson || "—"],
          ["Email", company?.email || "—"],
          ["Phone", company?.phone || "—"],
          [
            "Address",
            company
              ? `${company.address}, ${company.city}, ${company.state}, ${company.pin}`
              : "—",
          ],
          ["Website", company?.website || "—"],
        ]}
      />

      <InfoSection
        icon={FileCheck2}
        title="Legal Documents"
        rows={[
          ["PAN Card", documents?.panNumber || "—"],
          ["GST / VAT", documents?.gstTin || "—"],
          ["ROC No.", documents?.rocNumber || "—"],
        ]}
      />

      <InfoSection
        icon={CreditCard}
        title="Payment Details"
        rows={[
          ["Mode", fees?.paymentMode ? PAYMENT_MODE_LABELS[fees.paymentMode] : "—"],
          ["Ref. No.", fees?.referenceNumber || "—"],
          ["Signatory", declaration?.authorizedSignatory || "—"],
          ["Remarks", declaration?.additionalRemarks || "—"],
        ]}
      />

      <section className="rounded-xl border border-slate-200 bg-white">
        <header className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <Tags size={14} className="text-gs1-blue" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-700">
            Categories ({categoryLabels.length})
          </h3>
        </header>
        <div className="flex flex-wrap gap-2 p-3">
          {categoryLabels.length > 0 ? (
            categoryLabels.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No categories selected.</span>
          )}
        </div>
      </section>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
          <BadgeCheck size={16} />
          Declaration Confirmed
        </div>
        <p className="mt-1 text-xs text-emerald-700">
          {declaration?.consentAccepted
            ? "Your application will be processed within 7 business days of receipt."
            : "Declaration consent is pending."}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
        <ProgressDots active={6} total={6} />
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 min-w-[78px] items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 sm:min-w-[94px] sm:px-4 sm:text-sm"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onSubmitApplication}
            className="inline-flex h-10 min-w-[124px] items-center justify-center gap-2 rounded-md bg-gs1-orange px-3 text-xs font-semibold text-white shadow-sm transition hover:brightness-95 sm:min-w-[148px] sm:px-5 sm:text-sm"
          >
            <SendHorizontal size={14} strokeWidth={2.2} />
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoSection({
  icon: Icon,
  title,
  rows,
}: {
  icon: typeof Building2;
  title: string;
  rows: [string, string][];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <Icon size={14} className="text-gs1-blue" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-700">
          {title}
        </h3>
      </header>
      <div className="divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-2.5 text-xs">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-700">{value || "—"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgressDots({ active, total }: { active: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i + 1 === active;
        const isDone = i + 1 < active;
        return (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              isActive
                ? "w-6 bg-gs1-orange"
                : isDone
                  ? "w-3 bg-gs1-blue"
                  : "w-3 bg-slate-200"
            }`}
          />
        );
      })}
    </div>
  );
}

