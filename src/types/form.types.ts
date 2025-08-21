import type z from "zod";
import type { ProfileSchema } from "@/helpers/validations/form.schema";

export type ProfileFormValues = z.infer<typeof ProfileSchema>;

export type UploadImageValues = {
  file: File | null;
  acceptTerms: boolean;
};