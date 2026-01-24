import { z } from "zod";

/**
 * Sign In Schema
 * Validates user credentials for login
 */
export const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SigninFormData = z.infer<typeof signinSchema>;

/**
 * Sign Up Schema
 * Validates user registration with password confirmation
 */
export const signupSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
