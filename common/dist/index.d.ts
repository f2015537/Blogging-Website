import * as z from "zod";
export declare const SignInSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const SignUpSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const BlogSchema: z.ZodObject<{
    title: z.ZodString;
    body: z.ZodString;
    tags: z.ZodArray<z.ZodEnum<{
        Technology: "Technology";
        Programming: "Programming";
        Startups: "Startups";
        Productivity: "Productivity";
    }>>;
    published: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const IdSchema: z.ZodObject<{
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type BlogSchemaInput = z.infer<typeof BlogSchema>;
export type IdSchemaInput = z.infer<typeof IdSchema>;
//# sourceMappingURL=index.d.ts.map