import type z from "zod";
import type { ProfileSchema } from "@/pages/form/validate";

export type ProfileFormValues = z.infer<typeof ProfileSchema>;