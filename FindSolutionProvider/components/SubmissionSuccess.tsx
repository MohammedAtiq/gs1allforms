"use client";

import { CheckCheck, Home } from "lucide-react";
import type { CompanyInfoValues } from "../schemas/companyInfo";
import type { FeesValues } from "../steps/FeesStep";

interface SubmissionSuccessProps {
  company?: CompanyInfoValues;
  categoryCount: number;
  fees?: FeesValues;
  onBackToHome: () => void;
}

export function SubmissionSuccess({
  company,
  categoryCount,
  fees,
  onBackToHome,
}: SubmissionSuccessProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCheck size={26} />
        </div>

        <h2 className="text-2xl font-bold text-gs1-blue sm:text-3xl">
          Application Submitted!
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Thank you, <span className="font-semibold">{company?.contactPerson || "User"}</span>.
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Your application for{" "}
          <span className="font-semibold">{company?.companyName || "your company"}</span>{" "}
          has been received. Our team will contact you within{" "}
          <span className="font-semibold">3-5 business days</span>.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-50 p-2 sm:gap-2 sm:p-3">
          <Metric label="Categories" value={String(categoryCount)} />
          <Metric label="Processing" value="3-5 Days" />
          <Metric label="Reference" value={fees?.referenceNumber || "—"} />
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-gs1-blue px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gs1-blue-dark sm:px-5"
        >
          <Home size={14} />
          Back to Home
        </button>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md px-1 py-1.5 text-center">
      <p className="text-[10px] text-slate-500 sm:text-[11px]">{label}</p>
      <p className="mt-0.5 break-all text-lg font-bold leading-tight text-gs1-blue sm:text-xl">
        {value}
      </p>
    </div>
  );
}

