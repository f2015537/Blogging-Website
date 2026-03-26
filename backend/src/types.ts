import * as z from "zod";

const AuthCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const SignInSchema = AuthCredentialsSchema;

export const SignUpSchema = AuthCredentialsSchema.extend({
  name: z.string().min(1).optional(),
});

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
