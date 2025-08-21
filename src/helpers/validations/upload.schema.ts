import { ALLOWED_TYPES, MAX_BYTES, MIN_WIDTH, MIN_HEIGHT } from "@/constraints";
import { getImageDimensions } from "@/services/upload.service";
import z from "zod";

export const UploadSchema = z
  .object({
    file: z.any(),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, { message: "You must accept the terms" }),
  })
  .superRefine(async (val, ctx) => {
    const f: File | null = val.file as File | null;
    if (!f) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "File is required",
      });
      return;
    }
    if (!ALLOWED_TYPES.includes(f.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Only JPG/PNG allowed",
      });
    }
    if (f.size > MAX_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Max size 5MB",
      });
    }
    if (f.type.startsWith("image/")) {
      try {
        const { width, height } = await getImageDimensions(f);
        if (width < MIN_WIDTH || height < MIN_HEIGHT) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["file"],
            message: `Image must be ≥ ${MIN_WIDTH}x${MIN_HEIGHT}px`,
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file"],
          message: "Failed to read image",
        });
      }
    }
  });

export const validateUpload = async (values: any) => {
  const res = await UploadSchema.safeParseAsync(values);
  if (res.success) return {};
  const formErrors: Record<string, string> = {};
  res.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (path) formErrors[path] = issue.message;
  });
  return formErrors;
};
