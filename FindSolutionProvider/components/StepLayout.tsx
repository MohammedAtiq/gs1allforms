"use client";

import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../providers/LanguageProvider";
import { STEPS, type StepId } from "../types";

export function StepFormHeader({
  icon: Icon,
  stepId,
}: {
  icon: LucideIcon;
  stepId: StepId;
}) {
  const { t } = useTranslation();
  const step = STEPS.find((s) => s.id === stepId) ?? STEPS[0];

  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-gs1-blue">
          <Icon size={16} strokeWidth={2.2} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gs1-blue">{t(`steps.${stepId}Title`)}</h2>
          <p className="text-xs text-slate-500">{t(`steps.${stepId}Subtitle`)}</p>
        </div>
      </div>
      <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200 sm:px-3 sm:text-[11px]">
        {t("common.stepOf", { current: step.index, total: STEPS.length })}
      </span>
    </header>
  );
}

export function ProgressDots({ active, total }: { active: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i + 1 === active;
        const isDone = i + 1 < active;
        return (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              isActive ? "w-6 bg-gs1-orange" : isDone ? "w-3 bg-gs1-blue" : "w-3 bg-slate-200"
            }`}
          />
        );
      })}
    </div>
  );
}

interface StepFormFooterProps {
  /** 1-based step index for progress dots */
  active: number;
  showBack?: boolean;
  onBack?: () => void;
  primaryLabel: string;
  primaryType?: "button" | "submit";
  onPrimaryClick?: () => void;
  primaryVariant?: "blue" | "orange";
  primaryDisabled?: boolean;
}

export function StepFormFooter({
  active,
  showBack,
  onBack,
  primaryLabel,
  primaryType = "button",
  onPrimaryClick,
  primaryVariant = "blue",
  primaryDisabled,
}: StepFormFooterProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const primaryClass =
    primaryVariant === "orange"
      ? "bg-gs1-orange hover:brightness-95"
      : "bg-gs1-blue hover:bg-gs1-blue-dark";

  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
      <ProgressDots active={active} total={STEPS.length} />
      <div className={`${isRTL ? "mr-auto" : "ml-auto"} flex items-center gap-2`}>
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 min-w-[78px] items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 sm:min-w-[94px] sm:px-4 sm:text-sm"
          >
            {`${isRTL ? "→" : "←"} ${t("common.back")}`}
          </button>
        ) : null}
        <button
          type={primaryType}
          onClick={primaryType === "button" ? onPrimaryClick : undefined}
          disabled={primaryDisabled}
          className={`inline-flex h-10 min-w-[96px] items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold text-white shadow-sm transition disabled:opacity-60 sm:min-w-[110px] sm:px-5 sm:text-sm ${primaryClass}`}
        >
          {primaryLabel}
          <span aria-hidden>{isRTL ? "←" : "→"}</span>
        </button>
      </div>
    </div>
  );
}
