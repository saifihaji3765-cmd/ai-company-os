import { z } from "zod";

export const organizationNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(200);

export const organizationSlugSchema = z
  .string()
  .trim()
  .min(3)
  .max(63)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and single hyphens.",
  );

export const createOrganizationSchema = z
  .object({
    name: organizationNameSchema,
    slug: organizationSlugSchema,
  })
  .strict();

export const updateOrganizationSchema = z
  .object({
    name: organizationNameSchema.optional(),
    slug: organizationSlugSchema.optional(),
  })
  .strict();

export const organizationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const organizationListQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    status: z
      .enum(["active", "suspended", "deactivated"])
      .optional(),

    search: z
      .string()
      .trim()
      .max(200)
      .optional(),
  })
  .strict();

export type CreateOrganizationRequest = z.infer<
  typeof createOrganizationSchema
>;

export type UpdateOrganizationRequest = z.infer<
  typeof updateOrganizationSchema
>;

export type OrganizationListQueryRequest = z.infer<
  typeof organizationListQuerySchema
>;
