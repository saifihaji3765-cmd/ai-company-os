import { z } from "zod";

export const workspaceNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(200);

export const workspaceSlugSchema = z
  .string()
  .trim()
  .min(3)
  .max(63)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and single hyphens.",
  );

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

export const createWorkspaceSchema = z
  .object({
    organizationId: organizationIdSchema,
    name: workspaceNameSchema,
    slug: workspaceSlugSchema,
  })
  .strict();

export const updateWorkspaceSchema = z
  .object({
    name: workspaceNameSchema.optional(),
    slug: workspaceSlugSchema.optional(),
    status: z
      .enum(["active", "suspended", "archived"])
      .optional(),
  })
  .strict();

export const workspaceListQuerySchema = z
  .object({
    organizationId: organizationIdSchema,

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

export type CreateWorkspaceRequest = z.infer<
  typeof createWorkspaceSchema
>;

export type UpdateWorkspaceRequest = z.infer<
  typeof updateWorkspaceSchema
>;

export type WorkspaceListQueryRequest = z.infer<
  typeof workspaceListQuerySchema
>;
