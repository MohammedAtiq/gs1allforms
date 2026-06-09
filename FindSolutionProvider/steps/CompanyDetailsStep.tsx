"use client";

import { Building2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../common-components/Dropdown";
import { TextAreaField, TextField } from "../components/FormField";
import { StepFormFooter, StepFormHeader } from "../components/StepLayout";
import {
  companyProfileDefaults,
  companyProfileSchema,
  LEGAL_STATUS_OPTIONS,
  SAUDI_REGIONS,
  TURNOVER_OPTIONS,
  type CompanyProfileValues,
} from "../schemas/companyProfile";

interface CompanyDetailsStepProps {
  defaultValues?: Partial<CompanyProfileValues>;
  onBack: () => void;
  onSubmit: (values: CompanyProfileValues) => void;
  isSubmitting?: boolean;
}

function Subheading({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{children}</p>
  );
}

export function CompanyDetailsStep({
  defaultValues,
  onBack,
  onSubmit,
  isSubmitting: isApiSubmitting = false,
}: CompanyDetailsStepProps) {
  const { t } = useTranslation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyProfileValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: { ...companyProfileDefaults, ...defaultValues },
    mode: "onSubmit",
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-[620px] flex-col gap-5">
      <StepFormHeader icon={Building2} stepId="company" />

      <p className="text-sm text-slate-500">{t("company.intro")}</p>

      <Subheading>{t("company.sectionInfo")}</Subheading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          id="companyNameEn"
          label={t("company.nameEn")}
          placeholder={t("company.placeholderNameEn")}
          error={errors.companyNameEn?.message}
          {...register("companyNameEn")}
        />
        <TextField
          id="companyNameAr"
          label={t("company.nameAr")}
          placeholder={t("company.placeholderAr")}
          dir="rtl"
          error={errors.companyNameAr?.message}
          {...register("companyNameAr")}
        />
        <TextField
          id="crNumber"
          label={t("company.cr")}
          placeholder={t("company.placeholderCr10")}
          inputMode="numeric"
          maxLength={10}
          error={errors.crNumber?.message}
          {...register("crNumber")}
        />
        <TextField
          id="vatNumber"
          label={t("company.vat")}
          placeholder={t("company.placeholderVat")}
          inputMode="numeric"
          maxLength={15}
          error={errors.vatNumber?.message}
          {...register("vatNumber")}
        />
        <TextField
          id="corporateEmail"
          type="email"
          label={t("company.email")}
          placeholder="company@example.com.sa"
          error={errors.corporateEmail?.message}
          {...register("corporateEmail")}
        />
        <TextField
          id="mobile"
          label={t("company.mobile")}
          placeholder="+966501234567"
          autoComplete="tel"
          error={errors.mobile?.message}
          {...register("mobile")}
        />
      </div>

      <TextField
        id="address"
        label={t("company.address")}
        placeholder={t("company.placeholderAddress")}
        error={errors.address?.message}
        {...register("address")}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="region"
              label={t("company.region")}
              placeholder={t("company.selectRegion")}
              required
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={[...SAUDI_REGIONS].map((r) => ({ value: r, label: r }))}
              error={errors.region?.message}
            />
          )}
        />
        <TextField
          id="city"
          label={t("company.city")}
          placeholder="e.g. Riyadh"
          error={errors.city?.message}
          {...register("city")}
        />
        <TextField
          id="postalCode"
          label={t("company.postal")}
          placeholder={t("company.placeholderPostal")}
          inputMode="numeric"
          maxLength={5}
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
      </div>

      <Subheading>{t("company.sectionProfile")}</Subheading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          id="website"
          label={t("company.website")}
          optional
          placeholder="https://www.yourcompany.com.sa"
          error={errors.website?.message}
          {...register("website")}
        />
        <TextField
          id="yearEstablished"
          label={t("company.year")}
          optional
          placeholder="e.g. 2018"
          error={errors.yearEstablished?.message}
          {...register("yearEstablished")}
        />
        <Controller
          name="annualTurnover"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="annualTurnover"
              label={t("company.turnover")}
              placeholder={t("company.selectTurnover")}
              required
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={TURNOVER_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              error={errors.annualTurnover?.message}
            />
          )}
        />
        <Controller
          name="legalStatus"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="legalStatus"
              label={t("company.legal")}
              placeholder={t("company.selectLegal")}
              required
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={LEGAL_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              error={errors.legalStatus?.message}
            />
          )}
        />
      </div>

      <TextAreaField
        id="companyDescriptionEn"
        label={t("company.description")}
        optional
        placeholder={t("company.descriptionPh")}
        rows={4}
        error={errors.companyDescriptionEn?.message}
        {...register("companyDescriptionEn")}
      />

      <StepFormFooter
        active={2}
        showBack
        onBack={onBack}
        primaryLabel={t("common.saveNext")}
        primaryType="submit"
        primaryDisabled={isSubmitting || isApiSubmitting}
      />
    </form>
  );
}
