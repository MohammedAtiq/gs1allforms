"use client";

import { ArrowRightLeft, Building2, CreditCard, Landmark, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../common-components/Dropdown";
import { StepFormFooter, StepFormHeader } from "../components/StepLayout";
import { categoryTitleById, feesForCategoryIds } from "../constants/categories";

export type PaymentMethodId = "mada" | "visa_mc" | "sadad" | "bank";

export interface PaymentValues {
  paymentMethod: PaymentMethodId;
  tds: string;
  netAmountSar: number;
  subtotalSar: number;
  vatSar: number;
}

interface PaymentStepProps {
  selectedCategoryIds: string[];
  onBack: () => void;
  onSubmitPay: (values: PaymentValues) => void;
}

const VAT_RATE = 0.15;

const TDS_OPTIONS = [
  { value: "na", label: "Not Applicable" },
  { value: "5", label: "5%" },
  { value: "10", label: "10%" },
];

const PAYMENT_MODES: {
  id: PaymentMethodId;
  title: string;
  subtitle: string;
  icon: typeof CreditCard;
}[] = [
  { id: "mada", title: "mada Card", subtitle: "Local debit cards", icon: CreditCard },
  { id: "visa_mc", title: "Visa / MC", subtitle: "International cards", icon: Wallet },
  { id: "sadad", title: "SADAD Online", subtitle: "SADAD bill payment", icon: Building2 },
  { id: "bank", title: "Bank Transfer", subtitle: "Direct transfer", icon: Landmark },
];

function formatSarPlain(n: number): string {
  return `SAR ${n.toLocaleString("en-SA")}`;
}

export function PaymentStep({
  selectedCategoryIds,
  onBack,
  onSubmitPay,
}: PaymentStepProps) {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("mada");
  const [tds, setTds] = useState("na");

  const feeRows = useMemo(() => {
    return selectedCategoryIds.map((id) => ({
      id,
      label: categoryTitleById(id),
      amount: feesForCategoryIds([id]),
    }));
  }, [selectedCategoryIds]);

  const subtotal = useMemo(
    () => feesForCategoryIds(selectedCategoryIds),
    [selectedCategoryIds],
  );
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  function handlePay() {
    onSubmitPay({
      paymentMethod,
      tds,
      netAmountSar: total,
      subtotalSar: subtotal,
      vatSar: vat,
    });
  }

  return (
    <div className="flex min-h-[620px] flex-col gap-5">
      <StepFormHeader icon={ArrowRightLeft} stepId="payment" />

      <p className="text-sm text-slate-500">{t("payment.intro")}</p>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          {t("payment.feeSummary")}
        </p>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gs1-blue text-white">
              <tr className="text-xs">
                <th className="px-3 py-2 font-semibold">Category</th>
                <th className="px-3 py-2 font-semibold text-right">Fee (SAR)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {feeRows.length > 0 ? (
                feeRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-xs font-medium">{row.label}</td>
                    <td className="px-3 py-2 text-right text-xs font-semibold">
                      {formatSarPlain(row.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-slate-100">
                  <td colSpan={2} className="px-3 py-3 text-xs text-slate-500">
                    {t("payment.noCategories")}
                  </td>
                </tr>
              )}
              <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                <td className="px-3 py-2 text-xs">{t("payment.subtotal")}</td>
                <td className="px-3 py-2 text-right text-xs">{formatSarPlain(subtotal)}</td>
              </tr>
              <tr className="border-t border-slate-100 bg-slate-50">
                <td className="px-3 py-2 text-xs">{t("payment.vat")}</td>
                <td className="px-3 py-2 text-right text-xs font-medium">{formatSarPlain(vat)}</td>
              </tr>
              <tr className="border-t-2 border-slate-200 bg-gs1-blue/5">
                <td className="px-3 py-2.5 text-sm font-bold text-gs1-blue">{t("payment.total")}</td>
                <td className="px-3 py-2.5 text-right text-sm font-bold text-gs1-orange">
                  {formatSarPlain(total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900/90">
        {t("payment.note")}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          {t("payment.methodHeading")} <span className="text-gs1-orange">*</span>
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PAYMENT_MODES.map((mode) => {
            const isActive = paymentMethod === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setPaymentMethod(mode.id)}
                className={`rounded-xl border p-4 text-center transition ${
                  isActive
                    ? "border-gs1-blue bg-blue-50/40 ring-1 ring-gs1-blue"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
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
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Dropdown
            id="tds"
            label={t("payment.tds")}
            placeholder={t("payment.tds")}
            options={TDS_OPTIONS}
            value={tds}
            onChange={setTds}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              {t("payment.net")}
            </label>
            <div className="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-gs1-blue">
              {formatSarPlain(total)}
            </div>
          </div>
        </div>
      </div>

      <StepFormFooter
        active={6}
        showBack
        onBack={onBack}
        primaryLabel={t("payment.submitPay")}
        onPrimaryClick={handlePay}
        primaryVariant="orange"
      />
    </div>
  );
}
