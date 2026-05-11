import { z } from "zod";

const saMobile = z
  .string()
  .trim()
  .min(1, { message: "Mobile number is required" })
  .regex(/^\+966[0-9]{9}$/, {
    message: "Use format +966 followed by 9 digits",
  });

const emailReq = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Enter a valid email address" });

export const contactsSchema = z.object({
  billingName: z.string().trim().min(1, { message: "Full name is required" }),
  billingTitle: z.string().trim().min(1, { message: "Job title is required" }),
  billingMobile: saMobile,
  billingEmail: emailReq,
  headName: z.string().trim().min(1, { message: "Full name is required" }),
  headDesignation: z.string().trim().min(1, { message: "Designation is required" }),
  headMobile: saMobile,
  headEmail: emailReq,
  techName: z.string().trim().optional().or(z.literal("")),
  techDesignation: z.string().trim().optional().or(z.literal("")),
  techMobile: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .regex(/^\+966[0-9]{9}$/, { message: "Use format +966 followed by 9 digits" }),
  ]),
  techEmail: z
    .string()
    .trim()
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Enter a valid email address",
    }),
});

export type ContactsValues = z.infer<typeof contactsSchema>;

export const contactsDefaults: ContactsValues = {
  billingName: "",
  billingTitle: "",
  billingMobile: "",
  billingEmail: "",
  headName: "",
  headDesignation: "",
  headMobile: "",
  headEmail: "",
  techName: "",
  techDesignation: "",
  techMobile: "",
  techEmail: "",
};
