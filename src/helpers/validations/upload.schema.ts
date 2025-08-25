import * as Yup from "yup";
import z from "zod";
import {
  ALLOWED_TYPES,
  MAX_BYTES,
  MIN_WIDTH,
  MIN_HEIGHT,
  SUPPORTED_VIDEO_TYPES,
} from "@/constraints";
import { getImageDimensions } from "@/services/upload/upload.service";

export const UploadZodSchema = z
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
  const res = await UploadZodSchema.safeParseAsync(values); // chạy qua tất cả
  if (res.success) return {};
  const formErrors: Record<string, string> = {};
  res.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (path) formErrors[path] = issue.message;
  });
  return formErrors;
};

export const validationDemoSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(10, "Phone number too short")
    .max(15, "Phone number too long"),

  website: Yup.string()
    .url("Invalid URL format")
    .matches(/^https?:\/\//, "URL must start with http:// or https://"),

  // Number validations
  age: Yup.number()
    .typeError("Age must be a number")
    .positive("Age must be positive")
    .integer("Age must be a whole number")
    .min(18, "Must be at least 18 years old")
    .max(100, "Age cannot exceed 100"),

  // Date validations
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .test("age-range", "Age must be between 18 and 100", (value) => {
      if (!value) return false;
      const age = new Date().getFullYear() - value.getFullYear();
      return age >= 18 && age <= 100;
    }),

  // Array validations
  hobbies: Yup.array()
    .of(Yup.string().min(2, "Hobby must be at least 2 characters"))
    .min(1, "Select at least one hobby")
    .max(5, "Maximum 5 hobbies allowed"),

  // Object validations
  address: Yup.object({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    zipCode: Yup.string().matches(
      /^\d{5}(-\d{4})?$/,
      "Invalid ZIP code format"
    ),
    country: Yup.string().required("Country is required"),
  }),

  // Conditional validations
  hasCompany: Yup.boolean(),
  companyName: Yup.string().when("hasCompany", {
    is: true,
    then: (schema) =>
      schema.required("Company name is required when you have a company"),
    otherwise: (schema) => schema.optional(),
  }),

  // Custom validation functions
  username: Yup.string()
    .required("Username is required")
    .test("unique-username", "Username already exists", async (value) => {
      if (!value) return true;
      // Simulate API call to check username uniqueness
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existingUsernames = ["admin", "user", "test"];
      return !existingUsernames.includes(value.toLowerCase());
    }),

  // File validation with multiple types
  documents: Yup.mixed<File | File[]>()
    .test("fileCount", "Maximum 3 files allowed", (value) => {
      if (!value) return true;
      if (Array.isArray(value)) {
        return value.length <= 3;
      }
      return true;
    })
    .test("fileTypes", "Only PDF, DOC, and images allowed", (value) => {
      if (!value) return true;
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      if (Array.isArray(value)) {
        return value.every(
          (file) => file instanceof File && allowedTypes.includes(file.type)
        );
      }
      return value instanceof File && allowedTypes.includes(value.type);
    }),
});

export const validationSchemaImage = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .test(
      "no-consecutive-underscores",
      "Username cannot have consecutive underscores",
      (value) => {
        if (!value) return true;
        return !value.includes("__");
      }
    ),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must not exceed 50 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .test("no-common-passwords", "Password is too common", (value) => {
      if (!value) return true;
      const commonPasswords = [
        "password",
        "123456",
        "qwerty",
        "admin",
        "letmein",
      ];
      return !commonPasswords.includes(value.toLowerCase());
    }),

  file: Yup.mixed<File>()
    .required("File is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value || !(value instanceof File)) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Only video files are allowed", (value) => {
      if (!value || !(value instanceof File)) return false;
      return value.type.startsWith("video/");
    })
    .test(
      "fileName",
      "File name cannot contain special characters",
      (value) => {
        if (!value || !(value instanceof File)) return false;
        const fileName = value.name;
        const invalidChars = /[<>:"/\\|?*]/;
        return !invalidChars.test(fileName);
      }
    ),

  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

export function validateVideoFile(file: File , maxSize: number): {
  isValid: boolean;
  error?: string;
} {
  if (!SUPPORTED_VIDEO_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Loại file không được hỗ trợ. Hỗ trợ: ${SUPPORTED_VIDEO_TYPES.map(
        (type) => type.split("/")[1]
      ).join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File quá lớn. Kích thước tối đa: ${(
        maxSize /
        (1024 * 1024)
      ).toFixed(0)}MB`,
    };
  }

  return { isValid: true };
}