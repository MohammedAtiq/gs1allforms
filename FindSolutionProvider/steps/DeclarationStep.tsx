"use client";

import { CheckSquare, ShieldCheck } from "lucide-react";
import { useState } from "react";

export interface DeclarationValues {
  authorizedSignatory: string;
  additionalRemarks: string;
  consentAccepted: boolean;
}

interface DeclarationStepProps {
  defaultValues?: Partial<DeclarationValues>;
  onBack: () => void;
  onSubmit: (values: DeclarationValues) => void;
}

const declarationParagraphs = [
  "I/We hereby declare that the information furnished in this application form is true and correct to the best of my/our knowledge and belief.",
  "I/We understand that registration under the GS1 Saudi Arabia Solution Provider Programme only signifies recognition as an Authorised Solution Provider and does not imply formal accreditation by GS1 Saudi Arabia.",
  "I/We agree to abide by all the rules, regulations, and guidelines issued by GS1 Saudi Arabia from time to time.",
  "I/We agree not to misuse or misrepresent our association with GS1 Saudi Arabia and shall not use GS1 Saudi Arabia's logo without prior written permission.",
  "I/We understand that GS1 Saudi Arabia reserves the right to cancel/withdraw the Solution Provider status at any time without assigning any reason.",
  "I/We confirm that all documents submitted are genuine and self-attested copies of the originals.",
];

export function DeclarationStep({
  defaultValues,
  onBack,
  onSubmit,
}: DeclarationStepProps) {
  const [authorizedSignatory, setAuthorizedSignatory] = useState(
    defaultValues?.authorizedSignatory ?? "",
  );
  const [additionalRemarks, setAdditionalRemarks] = useState(
    defaultValues?.additionalRemarks ?? "",
  );
  const [consentAccepted, setConsentAccepted] = useState(
    defaultValues?.consentAccepted ?? false,
  );
  const [errors, setErrors] = useState<{
    authorizedSignatory?: string;
    consentAccepted?: string;
  }>({});

  function handleContinue() {
    const nextErrors: { authorizedSignatory?: string; consentAccepted?: string } = {};
    if (!authorizedSignatory.trim()) {
      nextErrors.authorizedSignatory = "Authorized signatory name is required.";
    }
    if (!consentAccepted) {
      nextErrors.consentAccepted = "You must accept the declaration to continue.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      authorizedSignatory: authorizedSignatory.trim(),
      additionalRemarks: additionalRemarks.trim(),
      consentAccepted,
    });
  }

  const remarksRemaining = 500 - additionalRemarks.length;

  return (
    <div className="flex min-h-[620px] flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-gs1-blue">
            <ShieldCheck size={16} strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-gs1-blue">Declaration</h2>
            <p className="text-xs text-slate-500">Authorisation & consent</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200 sm:px-3 sm:text-[11px]">
          Step 5 of 6
        </span>
      </header>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Declaration
        </p>
        <div className="max-h-[150px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
          {declarationParagraphs.map((line) => (
            <p key={line} className="mb-3 last:mb-0">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Authorized Signatory Name <span className="text-gs1-orange">*</span>
        </p>
        <input
          value={authorizedSignatory}
          onChange={(e) => {
            setAuthorizedSignatory(e.target.value);
            if (e.target.value.trim()) {
              setErrors((prev) => ({ ...prev, authorizedSignatory: undefined }));
            }
          }}
          placeholder="Full name of authorized signatory"
          className={`h-10 w-full rounded-md border px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 ${
            errors.authorizedSignatory
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-gs1-blue focus:ring-2 focus:ring-gs1-blue/20"
          }`}
        />
        {errors.authorizedSignatory ? (
          <p className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.authorizedSignatory}
          </p>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Additional Remarks{" "}
          <span className="font-normal normal-case tracking-normal text-slate-400">
            ({remarksRemaining}/500, optional)
          </span>
        </p>
        <textarea
          value={additionalRemarks}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setAdditionalRemarks(e.target.value);
            }
          }}
          placeholder="Any additional information or remarks (optional)"
          rows={3}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-gs1-blue focus:ring-2 focus:ring-gs1-blue/20"
        />
      </div>

      <label
        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
          consentAccepted
            ? "border-gs1-blue bg-blue-50/30"
            : errors.consentAccepted
              ? "border-rose-300 bg-rose-50/50"
              : "border-slate-200 bg-white"
        }`}
      >
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
            consentAccepted
              ? "border-gs1-blue bg-gs1-blue text-white"
              : "border-slate-300 bg-white text-transparent"
          }`}
        >
          <CheckSquare size={12} />
        </span>
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(e) => {
            setConsentAccepted(e.target.checked);
            if (e.target.checked) {
              setErrors((prev) => ({ ...prev, consentAccepted: undefined }));
            }
          }}
          className="sr-only"
        />
        <span className="text-xs text-slate-700">
          I confirm I have read, understood and agree to the declaration above.
          All information and documents provided are accurate and genuine.
        </span>
      </label>
      {errors.consentAccepted ? (
        <p className="-mt-3 text-xs font-medium text-rose-600">
          {errors.consentAccepted}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
        <ProgressDots active={5} total={6} />
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
            onClick={handleContinue}
            className="inline-flex h-10 min-w-[96px] items-center justify-center gap-2 rounded-md bg-gs1-blue px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-gs1-blue-dark sm:min-w-[110px] sm:px-5 sm:text-sm"
          >
            Continue
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
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

