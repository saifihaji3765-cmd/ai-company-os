import { z } from "zod";

export const organizationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const workspaceIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const projectIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const projectNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(200);

export const projectSlugSchema = z
  .string()
  .trim()
  .min(3)
  .max(63)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and single hyphens.",
  );

export const createProjectSchema = z
  .object({
    organizationId: organizationIdSchema,
    workspaceId: workspaceIdSchema,
    name: projectNameSchema,
    slug: projectSlugSchema,
  })
  .strict();

export const updateProjectSchema = z
  .object({
    name: projectNameSchema.optional(),
    slug: projectSlugSchema.optional(),
    status: z
      .enum(["active", "suspended", "archived"])
      .optional(),
  })
  .strict();

export const projectListQuerySchema = z
  .object({
    organizationId: organizationIdSchema,
    workspaceId: workspaceIdSchema,

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
      .enum(["active", "suspended", "archived"])
      .optional(),

    search: z
      .string()
      .trim()
      .max(200)
      .optional(),
  })
  .strict();

export type CreateProjectRequest = z.infer<
  typeof createProjectSchema
>;

export type UpdateProjectRequest = z.infer<
  typeof updateProjectSchema
>;

export type ProjectListQueryRequest = z.infer<
  typeof projectListQuerySchema
>;
