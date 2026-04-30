"use client";

import { ArrowRightLeft, Building2, CreditCard, ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";

type PaymentMode = "online" | "dd" | "neft";

export interface FeesValues {
  paymentMode: PaymentMode;
  referenceNumber: string;
}

interface FeesStepProps {
  selectedCategories?: string[];
  defaultValues?: Partial<FeesValues>;
  onBack: () => void;
  onSubmit: (values: FeesValues) => void;
}

const CATEGORY_FEES: Record<
  string,
  { label: string; annualFee: number; oneTime: number }
> = {
  barcode: { label: "Barcode Solution Provider", annualFee: 25000, oneTime: 10000 },
  auth: { label: "Authentication Solution Provider", annualFee: 30000, oneTime: 12000 },
  printing: { label: "Online Printing Solution Provider", annualFee: 20000, oneTime: 8000 },
  integrator: { label: "System Integrators", annualFee: 18000, oneTime: 7500 },
  retail: { label: "Retail Software Solution Provider", annualFee: 22000, oneTime: 9000 },
  packaging: { label: "Packaging", annualFee: 15000, oneTime: 6000 },
  rfid: { label: "RFID Solution Provider", annualFee: 26000, oneTime: 11000 },
  catalog: { label: "Images, Dimensions & e-Cataloguing", annualFee: 16000, oneTime: 6500 },
};

const PAYMENT_MODES: {
  id: PaymentMode;
  title: string;
  subtitle: string;
  icon: typeof CreditCard;
  recommended?: boolean;
}[] = [
  {
    id: "online",
    title: "Online",
    subtitle: "Card / Mada / Net Banking",
    icon: CreditCard,
    recommended: true,
  },
  {
    id: "dd",
    title: "Demand Draft",
    subtitle: "DD / Pay Order",
    icon: ReceiptText,
  },
  {
    id: "neft",
    title: "NEFT",
    subtitle: "Bank Transfer",
    icon: Building2,
  },
];

export function FeesStep({
  selectedCategories,
  defaultValues,
  onBack,
  onSubmit,
}: FeesStepProps) {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(
    defaultValues?.paymentMode ?? "online",
  );
  const [referenceNumber, setReferenceNumber] = useState(
    defaultValues?.referenceNumber ?? "",
  );
  const [errors, setErrors] = useState<{ mode?: string; reference?: string }>({});

  const feeRows = useMemo(() => {
    const ids = selectedCategories?.length ? selectedCategories : ["barcode", "auth"];
    return ids
      .map((id) => CATEGORY_FEES[id])
      .filter(Boolean)
      .slice(0, 3);
  }, [selectedCategories]);

  function handleContinue() {
    const nextErrors: { mode?: string; reference?: string } = {};
    if (!paymentMode) {
      nextErrors.mode = "Please select a payment mode.";
    }
    if (!referenceNumber.trim()) {
      nextErrors.reference = "Transaction / DD / reference number is required.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ paymentMode, referenceNumber: referenceNumber.trim() });
  }

  return (
    <div className="flex min-h-[620px] flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-gs1-blue">
            <ArrowRightLeft size={16} strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-gs1-blue">Fee & Payment</h2>
            <p className="text-xs text-slate-500">Fees & payment method</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200 sm:px-3 sm:text-[11px]">
          Step 4 of 6
        </span>
      </header>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Fee Schedule For Selected Categories
        </p>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gs1-blue text-white">
              <tr className="text-xs">
                <th className="px-3 py-2 font-semibold">Category</th>
                <th className="px-3 py-2 font-semibold">Annual Fee</th>
                <th className="px-3 py-2 font-semibold">One-Time</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {feeRows.map((row) => (
                <tr key={row.label} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-xs font-medium">{row.label}</td>
                  <td className="px-3 py-2 text-xs font-semibold">
                    SAR {row.annualFee.toLocaleString("en-SA")}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    SAR {row.oneTime.toLocaleString("en-SA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Select Payment Mode <span className="text-gs1-orange">*</span>
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {PAYMENT_MODES.map((mode) => {
            const isActive = paymentMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setPaymentMode(mode.id);
                  setErrors((prev) => ({ ...prev, mode: undefined }));
                }}
                className={`relative rounded-xl border p-4 text-center transition ${
                  isActive
                    ? "border-gs1-blue bg-blue-50/40 ring-1 ring-gs1-blue"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {mode.recommended ? (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gs1-orange px-2 py-0.5 text-[10px] font-semibold text-white">
                    Recommended
                  </span>
                ) : null}
                <span
                  className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md ${
                    isActive ? "bg-gs1-blue text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon size={15} />
                </span>
                <p className="text-sm font-semibold text-slate-700">{mode.title}</p>
                <p className="mt-1 text-[11px] text-slate-500">{mode.subtitle}</p>
              </button>
            );
          })}
        </div>
        {errors.mode ? <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.mode}</p> : null}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Transaction / DD / Reference No. <span className="text-gs1-orange">*</span>
        </p>
        <input
          value={referenceNumber}
          onChange={(e) => {
            setReferenceNumber(e.target.value);
            if (e.target.value.trim()) {
              setErrors((prev) => ({ ...prev, reference: undefined }));
            }
          }}
          placeholder="Enter your payment reference number"
          className={`h-10 w-full rounded-md border px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 ${
            errors.reference
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-gs1-blue focus:ring-2 focus:ring-gs1-blue/20"
          }`}
        />
        <p className="mt-1.5 text-[11px] text-slate-400">
          ⓘ Used to verify your payment with our accounts team.
        </p>
        {errors.reference ? (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.reference}</p>
        ) : null}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
        <ProgressDots active={4} total={6} />
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

