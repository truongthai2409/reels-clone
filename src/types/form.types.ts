import type z from "zod";
import { ProfileSchema } from "../component/page/form/validate";

export type ProfileFormValues = z.infer<typeof ProfileSchema>;