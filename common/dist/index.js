import * as z from "zod";
const AuthCredentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});
export const SignInSchema = AuthCredentialsSchema;
export const SignUpSchema = AuthCredentialsSchema.extend({
    name: z.string().min(1).optional(),
});
const CATEGORY_VALUES = [
    "Technology",
    "Programming",
    "Startups",
    "Productivity",
];
export const BlogSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    tags: z
        .array(z.enum(CATEGORY_VALUES))
        .min(1)
        .refine((tags) => new Set(tags).size === tags.length, {
        message: "Tags must be unique",
    }),
    published: z.boolean().optional(),
});
export const IdSchema = z.object({
    id: z.coerce.number().int().positive(),
});
//# sourceMappingURL=index.js.map