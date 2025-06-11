import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createAccountSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  location: z.string().optional(),
  contact_email: z
    .string()
    .optional()
    .refine(
      (email) => !email || z.string().email().safeParse(email).success,
      "Please enter a valid email address"
    ),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

export const createDocumentSchema = z.object({
  account_id: z.string().min(1, "Account ID is required"),
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().optional(),
  file_path: z.string().optional(),
  file_size: z.number().positive("File size must be positive").optional(),
  file_type: z.string().optional(),
});

export const updateDocumentSchema = createDocumentSchema
  .omit({ account_id: true })
  .partial();

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    })
    .refine((file) => file.name.length > 0, {
      message: "File name cannot be empty",
    }),
  account_id: z.string().min(1, "Account ID is required"),
  description: z.string().optional().or(z.literal(undefined)),
});
