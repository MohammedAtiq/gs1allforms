"use client";

import { FileText, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StepFormFooter, StepFormHeader } from "../components/StepLayout";

export interface FileMeta {
  name: string;
  size: number;
  type: string;
}

export interface DocumentsValues {
  crCertificate: FileMeta | null;
  vatCertificate: FileMeta | null;
  financialStatements: FileMeta | null;
  plStatement: FileMeta | null;
  companyProfileBrochure: FileMeta | null;
  technicalCapability: FileMeta | null;
}

interface DocumentsStepProps {
  defaultValues?: Partial<DocumentsValues>;
  onBack: () => void;
  onSubmit: (values: DocumentsValues) => void;
}

const empty: DocumentsValues = {
  crCertificate: null,
  vatCertificate: null,
  financialStatements: null,
  plStatement: null,
  companyProfileBrochure: null,
  technicalCapability: null,
};

type DocKey = keyof DocumentsValues;

const MANDATORY: { key: DocKey; label: string; maxMb: number; pdfOnly?: boolean }[] = [
  { key: "crCertificate", label: "Commercial Registration (CR) Certificate", maxMb: 5 },
  { key: "vatCertificate", label: "ZATCA VAT Registration Certificate", maxMb: 5 },
  { key: "financialStatements", label: "Audited Financial Statements - 2 Years", maxMb: 10, pdfOnly: true },
  { key: "plStatement", label: "Profit & Loss Statement", maxMb: 5 },
];

const OPTIONAL: { key: DocKey; label: string; maxMb: number }[] = [
  { key: "companyProfileBrochure", label: "Company Profile / Brochure", maxMb: 10 },
  { key: "technicalCapability", label: "Technical Capability Document", maxMb: 10 },
];

function toMeta(file: File): FileMeta {
  return { name: file.name, size: file.size, type: file.type };
}

function validateFile(file: File, maxMb: number, pdfOnly?: boolean): string | null {
  if (file.size > maxMb * 1024 * 1024) {
    return `File must be at most ${maxMb}MB.`;
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (pdfOnly) {
    if (ext !== "pdf" && file.type !== "application/pdf") {
      return "PDF only for this field.";
    }
  } else {
    if (!["pdf", "jpg", "jpeg"].includes(ext)) {
      return "PDF or JPG only.";
    }
  }
  return null;
}

export function DocumentsStep({ defaultValues, onBack, onSubmit }: DocumentsStepProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<DocumentsValues>({ ...empty, ...defaultValues });
  const [errors, setErrors] = useState<Partial<Record<DocKey, string>>>({});
  const [formError, setFormError] = useState("");

  const setFile = useCallback((key: DocKey, file: File | null, err?: string) => {
    setValues((prev) => ({ ...prev, [key]: file ? toMeta(file) : null }));
    setErrors((prev) => ({ ...prev, [key]: err }));
    setFormError("");
  }, []);

  function handleContinue() {
    const next: Partial<Record<DocKey, string>> = {};
    for (const f of MANDATORY) {
      if (!values[f.key]) {
        next[f.key] = t("documents.required");
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setFormError(t("documents.completeMandatory"));
      return;
    }
    onSubmit(values);
  }

  return (
    <div className="flex min-h-[620px] flex-col gap-5">
      <StepFormHeader icon={FileText} stepId="documents" />

      <p className="text-sm text-slate-500">{t("documents.intro")}</p>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900/90">
        {t("documents.reviewNote")}
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {t("documents.mandatoryHeading")}
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {MANDATORY.map((field) => (
          <UploadCard
            key={field.key}
            label={field.label}
            required
            hint={
              field.pdfOnly
                ? t("documents.hintPdf", { max: field.maxMb })
                : t("documents.hintPdfJpg", { max: field.maxMb })
            }
            accept={
              field.pdfOnly ? ".pdf,application/pdf" : ".pdf,.jpg,.jpeg,image/jpeg,application/pdf"
            }
            error={errors[field.key]}
            meta={values[field.key]}
            onFile={(file) => {
              if (!file) {
                setFile(field.key, null);
                return;
              }
              const msg = validateFile(file, field.maxMb, field.pdfOnly);
              if (msg) setFile(field.key, null, msg);
              else setFile(field.key, file);
            }}
          />
        ))}
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {t("documents.optionalHeading")}
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {OPTIONAL.map((field) => (
          <UploadCard
            key={field.key}
            label={field.label}
            hint={t("documents.hintPdf", { max: field.maxMb })}
            accept=".pdf,application/pdf"
            error={errors[field.key]}
            meta={values[field.key]}
            onFile={(file) => {
              if (!file) {
                setFile(field.key, null);
                return;
              }
              const msg = validateFile(file, field.maxMb, true);
              if (msg) setFile(field.key, null, msg);
              else setFile(field.key, file);
            }}
          />
        ))}
      </div>

      {formError ? <p className="text-xs font-medium text-rose-600">{formError}</p> : null}

      <StepFormFooter
        active={3}
        showBack
        onBack={onBack}
        primaryLabel={t("common.saveNext")}
        onPrimaryClick={handleContinue}
      />
    </div>
  );
}

function UploadCard({
  label,
  required,
  hint,
  accept,
  meta,
  error,
  onFile,
}: {
  label: string;
  required?: boolean;
  hint: string;
  accept: string;
  meta: FileMeta | null;
  error?: string;
  onFile: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    onFile(f);
    e.target.value = "";
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
          <Upload size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-700">
            {label}
            {required ? <span className="text-gs1-orange"> *</span> : null}
          </p>
          <p className="text-[11px] text-slate-500">{hint}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-200 bg-slate-50/80 py-6 text-xs text-slate-600 transition hover:border-gs1-blue hover:bg-blue-50/30 ${
          error ? "border-rose-300 bg-rose-50/40" : ""
        }`}
      >
        <span className="font-medium text-slate-700">Click to upload or drag & drop</span>
        {meta ? (
          <span className="mt-1 max-w-full truncate px-2 text-[11px] font-semibold text-emerald-700">
            {meta.name}
          </span>
        ) : null}
      </button>
      <input ref={inputRef} type="file" accept={accept} className="sr-only" onChange={onChange} />
      {error ? <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
