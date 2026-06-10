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
  QrCode,
  RadioTower,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../providers/LanguageProvider";
import { PROVIDER_CATEGORIES } from "../constants/categories";
import { StepFormFooter, StepFormHeader } from "../components/StepLayout";

interface CategoryStepProps {
  defaultSelected?: string[];
  onSubmit: (selected: string[]) => void;
}

const ICON_BY_ID: Record<string, { icon: LucideIcon; iconClass: string }> = {
  barcode: { icon: Barcode, iconClass: "bg-blue-100 text-blue-700" },
  online_printing: { icon: Printer, iconClass: "bg-emerald-100 text-emerald-700" },
  retail_pos: { icon: ShoppingBag, iconClass: "bg-rose-100 text-rose-700" },
  epc_rfid: { icon: RadioTower, iconClass: "bg-teal-100 text-teal-700" },
  gs1_digital_link: { icon: QrCode, iconClass: "bg-cyan-100 text-cyan-700" },
  authentication: { icon: Fingerprint, iconClass: "bg-indigo-100 text-indigo-700" },
  system_integrator: { icon: MonitorCog, iconClass: "bg-violet-100 text-violet-700" },
  packaging: { icon: Box, iconClass: "bg-amber-100 text-amber-700" },
  images_ecatalog: { icon: FileImage, iconClass: "bg-sky-100 text-sky-700" },
  others: { icon: Grid2x2, iconClass: "bg-slate-100 text-slate-700" },
};

export function CategoryStep({ defaultSelected = [], onSubmit }: CategoryStepProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [error, setError] = useState("");

  const selectedItems = useMemo(
    () => PROVIDER_CATEGORIES.filter((c) => selected.includes(c.id)),
    [selected],
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setError("");
  }

  function handleContinue() {
    if (selected.length === 0) {
      setError(t("categories.selectOne"));
      return;
    }
    onSubmit(selected);
  }

  return (
    <div className="flex min-h-[620px] flex-col gap-5">
      <StepFormHeader icon={Grid2x2} stepId="categories" />

      <p className="text-sm text-slate-500">{t("categories.intro")}</p>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-600">
        {t("categories.banner")}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {PROVIDER_CATEGORIES.map((item) => {
          const isSelected = selected.includes(item.id);
          const meta =
            ICON_BY_ID[item.id] ?? { icon: Grid2x2, iconClass: "bg-slate-100 text-slate-700" };
          const Icon = meta.icon;
          return (
            <button
              key={item.id}
              type="button"
              title={item.description}
              onClick={() => toggle(item.id)}
              className={`flex h-[50px] cursor-pointer items-center gap-3 rounded-xl border px-3 text-left transition ${
                isSelected
                  ? "border-gs1-blue bg-blue-50/40 ring-1 ring-gs1-blue"
                  : "border-slate-200 bg-white hover:border-slate-300"
              } ${isRTL ? "flex-row-reverse text-right" : ""}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                  isSelected ? "bg-gs1-blue text-white" : meta.iconClass
                }`}
              >
                <Icon size={15} />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                {item.title}
              </span>
              <span className={isRTL ? "mr-auto" : "ml-auto"}>
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
          {selected.length}{" "}
          {selected.length === 1 ? t("categories.oneSelected") : t("categories.manySelected")}
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
            <span className="text-xs text-slate-500">{t("review.noCategories")}</span>
          )}
        </div>
      </div>

      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}

      <StepFormFooter
        active={1}
        primaryLabel={t("common.saveNext")}
        onPrimaryClick={handleContinue}
      />
    </div>
  );
}
