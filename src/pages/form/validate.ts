import z from "zod";
import { calcAge } from "@/services/form.services"; 

const HighlightSchema = z
  .string()
  .trim()
  .min(0, "Highlight is required")
  .max(80, "Max 80 characters");

const ExperienceSchema = z
  .object({
    id: z.string(), // Required id for drag & drop
    company: z.string().trim().min(2, "Min 2 chars").max(100, "Max 100 chars"),
    role: z.string().trim().min(2, "Min 2 chars").max(100, "Max 100 chars"),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().optional().nullable(),
    highlights: z.array(HighlightSchema).optional().default([]),
  })
  .superRefine((val, ctx) => {
    if (val.endDate && val.startDate) {
      const start = new Date(val.startDate);
      const end = new Date(val.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be ≥ start date",
          path: ["endDate"],
        });
      }
    }
  });

const GenderEnum = z.enum(["male", "female", "other"]);

export const ProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be 2–50 chars")
      .max(50, "Name must be 2–50 chars"),
    email: z.string().email("Invalid email"),
    aboutMe: z.string().max(300, "Max 300 characters").optional().default(""),
    birthday: z.string().min(1, "Birthday is required"),
    gender: GenderEnum,
    nationality: z
      .array(z.string())
      .min(1, "Select at least 1 nationality")
      .optional()
      .default([]),
    website: z
      .string()
      .optional()
      .refine((val) => !val || /^(https?:\/\/)/i.test(val), {
        message: "Must start with http/https",
      }),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, { message: "You must accept terms" }),
    experiences: z
      .array(ExperienceSchema)
      .min(1, "Add at least one experience"),
  })
  .superRefine((val, ctx) => {
    // Age ≥ 13
    const age = calcAge(val.birthday);
    if (age < 13) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must be at least 13 years old",
        path: ["birthday"],
      });
    }
  });
