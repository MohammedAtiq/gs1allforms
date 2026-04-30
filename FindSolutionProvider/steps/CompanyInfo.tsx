"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TextAreaField,
  TextField,
} from "../components/FormField";
import { Dropdown } from "../common-components/Dropdown";
import {
  companyInfoDefaults,
  companyInfoSchema,
  type CompanyInfoValues,
} from "../schemas/companyInfo";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

interface CompanyInfoProps {
  defaultValues?: Partial<CompanyInfoValues>;
  onSubmit: (values: CompanyInfoValues) => void;
}

export function CompanyInfo({ defaultValues, onSubmit }: CompanyInfoProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInfoValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: { ...companyInfoDefaults, ...defaultValues },
    mode: "onSubmit",
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gs1-blue/10 text-gs1-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-4" />
            </svg>
          </span>
          <div>
            <h2 className="text-base font-semibold text-gs1-blue">
              Company Info
            </h2>
            <p className="text-xs text-slate-500">Basic company details</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200 sm:px-3 sm:text-[11px]">
          Step 1 of 6
        </span>
      </header>

      <TextField
        id="companyName"
        label="Company / Organisation Name"
        placeholder="e.g. Acme Technologies Pvt. Ltd."
        autoComplete="organization"
        error={errors.companyName?.message}
        {...register("companyName")}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          id="contactPerson"
          label="Contact Person"
          placeholder="Full name"
          autoComplete="name"
          error={errors.contactPerson?.message}
          {...register("contactPerson")}
        />
        <TextField
          id="designation"
          label="Designation"
          placeholder="e.g. Managing Director"
          autoComplete="organization-title"
          error={errors.designation?.message}
          {...register("designation")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          id="email"
          type="email"
          label="Email Address"
          placeholder="company@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="phone"
          label="Phone Number"
          placeholder="+966 XXXXX XXXX"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <TextAreaField
        id="address"
        label="Registered Address"
        placeholder="Street address, building / plot number"
        rows={2}
        autoComplete="street-address"
        error={errors.address?.message}
        {...register("address")}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <TextField
          id="city"
          label="City"
          placeholder="City"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register("city")}
        />
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="state"
              label="State"
              placeholder="Select state"
              required
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
              error={errors.state?.message}
            />
          )}
        />
        <TextField
          id="pin"
          label="PIN Code"
          placeholder="6-digit PIN"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          error={errors.pin?.message}
          {...register("pin")}
        />
      </div>

      <TextField
        id="website"
        label="Website URL"
        optional
        placeholder="https:// www.yourcompany.com"
        autoComplete="url"
        error={errors.website?.message}
        {...register("website")}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
        <ProgressDots active={1} total={6} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 min-w-[96px] items-center justify-center gap-2 rounded-md bg-gs1-blue px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-gs1-blue-dark disabled:opacity-60 sm:px-5 sm:text-sm"
        >
          Continue
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
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
