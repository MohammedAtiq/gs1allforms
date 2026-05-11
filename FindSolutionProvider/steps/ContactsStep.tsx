"use client";

import { Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { TextField } from "../components/FormField";
import { StepFormFooter, StepFormHeader } from "../components/StepLayout";
import {
  contactsDefaults,
  contactsSchema,
  type ContactsValues,
} from "../schemas/contacts";

interface ContactsStepProps {
  defaultValues?: Partial<ContactsValues>;
  onBack: () => void;
  onSubmit: (values: ContactsValues) => void;
}

function Subheading({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{children}</p>
  );
}

export function ContactsStep({ defaultValues, onBack, onSubmit }: ContactsStepProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactsValues>({
    resolver: zodResolver(contactsSchema),
    defaultValues: { ...contactsDefaults, ...defaultValues },
    mode: "onSubmit",
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-[620px] flex-col gap-5">
      <StepFormHeader icon={Users} stepId="contacts" />

      <p className="text-sm text-slate-500">{t("contacts.intro")}</p>

      <Subheading>{t("contacts.billing")}</Subheading>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          id="billingName"
          label={t("contacts.fullName")}
          placeholder={t("contacts.phBillingName")}
          error={errors.billingName?.message}
          {...register("billingName")}
        />
        <TextField
          id="billingTitle"
          label={t("contacts.jobTitle")}
          placeholder={t("contacts.phJob")}
          error={errors.billingTitle?.message}
          {...register("billingTitle")}
        />
        <TextField
          id="billingMobile"
          label={t("contacts.mobile")}
          placeholder="+966501234567"
          error={errors.billingMobile?.message}
          {...register("billingMobile")}
        />
        <TextField
          id="billingEmail"
          type="email"
          label={t("contacts.email")}
          placeholder="billing@company.com"
          error={errors.billingEmail?.message}
          {...register("billingEmail")}
        />
      </div>

      <Subheading>{t("contacts.head")}</Subheading>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          id="headName"
          label={t("contacts.fullName")}
          placeholder={t("contacts.phHeadName")}
          error={errors.headName?.message}
          {...register("headName")}
        />
        <TextField
          id="headDesignation"
          label={t("contacts.designation")}
          placeholder={t("contacts.phCeo")}
          error={errors.headDesignation?.message}
          {...register("headDesignation")}
        />
        <TextField
          id="headMobile"
          label={t("contacts.mobile")}
          placeholder="+966501234567"
          error={errors.headMobile?.message}
          {...register("headMobile")}
        />
        <TextField
          id="headEmail"
          type="email"
          label={t("contacts.email")}
          placeholder="ceo@company.com"
          error={errors.headEmail?.message}
          {...register("headEmail")}
        />
      </div>

      <Subheading>{t("contacts.techOptional")}</Subheading>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          id="techName"
          label={t("contacts.fullName")}
          optional
          placeholder={t("contacts.phTechName")}
          error={errors.techName?.message}
          {...register("techName")}
        />
        <TextField
          id="techDesignation"
          label={t("contacts.designation")}
          optional
          placeholder={t("contacts.phTechRole")}
          error={errors.techDesignation?.message}
          {...register("techDesignation")}
        />
        <TextField
          id="techMobile"
          label={t("contacts.mobile")}
          optional
          placeholder="+966501234567"
          error={errors.techMobile?.message}
          {...register("techMobile")}
        />
        <TextField
          id="techEmail"
          type="email"
          label={t("contacts.email")}
          optional
          placeholder="tech@company.com"
          error={errors.techEmail?.message}
          {...register("techEmail")}
        />
      </div>

      <StepFormFooter
        active={4}
        showBack
        onBack={onBack}
        primaryLabel={t("common.saveNext")}
        primaryType="submit"
        primaryDisabled={isSubmitting}
      />
    </form>
  );
}
