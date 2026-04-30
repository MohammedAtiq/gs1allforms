"use client";

import {
  Barcode,
  Box,
  Check,
  Circle,
  FileImage,
  Fingerprint,
  Grid2x2,
  MonitorCog,
  Printer,
  RadioTower,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface CategoryStepProps {
  defaultSelected?: string[];
  onBack: () => void;
  onSubmit: (selected: string[]) => void;
}

interface CategoryItem {
  id: string;
  title: string;
  icon: LucideIcon;
  iconClass: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "barcode",
    title: "Barcode Solution Provider",
    icon: Barcode,
    iconClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "auth",
    title: "Authentication Solution Provider",
    icon: Fingerprint,
    iconClass: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "printing",
    title: "Online Printing Solution Provider",
    icon: Printer,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "integrator",
    title: "System Integrators",
    icon: MonitorCog,
    iconClass: "bg-violet-100 text-violet-700",
  },
  {
    id: "retail",
    title: "Retail Software Solution Provider",
    icon: ShoppingBag,
    iconClass: "bg-rose-100 text-rose-700",
  },
  {
    id: "packaging",
    title: "Packaging",
    icon: Box,
    iconClass: "bg-amber-100 text-amber-700",
  },
  {
    id: "rfid",
    title: "RFID Solution Provider",
    icon: RadioTower,
    iconClass: "bg-teal-100 text-teal-700",
  },
  {
    id: "catalog",
    title: "Images, Dimensions & e-Cataloguing",
    icon: FileImage,
    iconClass: "bg-cyan-100 text-cyan-700",
  },
];

export function CategoryStep({
  defaultSelected = [],
  onBack,
  onSubmit,
}: CategoryStepProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [error, setError] = useState<string>("");

  const selectedItems = useMemo(
    () => CATEGORIES.filter((item) => selected.includes(item.id)),
    [selected],
  );

  function toggleCategory(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((value) => value !== id);
      }
      return [...prev, id];
    });
    setError("");
  }

  function handleContinue() {
    if (selected.length === 0) {
      setError("Please select at least one category to continue.");
      return;
    }
    onSubmit(selected);
  }

  return (
    <div className="flex min-h-[620px] flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-gs1-blue">
            <Grid2x2 size={16} strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-gs1-blue">Category</h2>
            <p className="text-xs text-slate-500">Registration categories</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200 sm:px-3 sm:text-[11px]">
          Step 2 of 6
        </span>
      </header>

      <p className="text-sm text-slate-500">
        Select one or more categories that best describe your solution offering.
        You may select multiple.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {CATEGORIES.map((item) => {
          const isSelected = selected.includes(item.id);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleCategory(item.id)}
              className={`flex h-[50px] items-center gap-3 rounded-xl border px-3 text-left transition ${
                  isSelected
                    ? "border-gs1-blue bg-blue-50/40 ring-1 ring-gs1-blue"
                    : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                  isSelected
                    ? "bg-gs1-blue text-white"
                    : item.iconClass
                }`}
              >
                <Icon size={15} />
              </span>
              <span className="text-sm font-medium text-slate-700">{item.title}</span>
              <span className="ml-auto">
                {isSelected ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gs1-blue text-white">
                    <Check size={12} />
                  </span>
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white">
                    <Circle size={12} className="text-slate-300" />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
        <p className="text-xs font-semibold text-slate-600">
          {selected.length} {selected.length === 1 ? "category" : "categories"} selected
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center rounded-full bg-gs1-blue px-2.5 py-1 text-[11px] font-medium text-white"
              >
                {item.title}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No category selected yet.</span>
          )}
        </div>
      </div>

      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
        <ProgressDots active={2} total={6} />
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

