"use client";

import { STEPS, type StepId } from "../types";

interface MobileStepCardProps {
  currentStep: StepId;
}

export function MobileStepCard({ currentStep }: MobileStepCardProps) {
  const current = STEPS.find((step) => step.id === currentStep) ?? STEPS[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:hidden">
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gs1-orange text-sm font-bold text-white">
            {current.index}
          </span>
          <div className="leading-tight">
            <p className="text-lg font-semibold text-gs1-blue sm:text-xl">
              {current.title}
            </p>
            <p className="text-xs text-slate-400 sm:text-sm">{current.subtitle}</p>
          </div>
        </div>
        <span className="whitespace-nowrap pt-1 text-[11px] font-semibold tracking-[0.08em] text-slate-400 sm:text-sm">
          STEP {current.index} OF {STEPS.length}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {STEPS.map((step) => (
          <span
            key={step.id}
            className={`h-1.5 flex-1 rounded-full ${
              step.index === current.index
                ? "bg-gs1-orange"
                : step.index < current.index
                  ? "bg-gs1-blue"
                  : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

