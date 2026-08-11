import { z } from "zod";

export const roleIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const roleKeySchema = z.enum([
  "owner",
  "operator",
  "ai_agent",
  "automation",
]);

export const roleNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(100);

export const roleDescriptionSchema = z
  .string()
  .trim()
  .min(1)
  .max(500);

export const roleScopeSchema = z.enum([
  "platform",
  "organization",
  "workspace",
  "project",
]);

export const roleStatusSchema = z.enum([
  "active",
  "disabled",
]);

export const createRoleSchema = z
  .object({
    key: roleKeySchema,
    name: roleNameSchema,
    description: roleDescriptionSchema,
    scope: roleScopeSchema,
    systemManaged: z.boolean(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.key === "owner" &&
      value.scope !== "platform"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scope"],
        message:
          "Owner role must use platform scope.",
      });
    }

    if (
      value.key === "owner" &&
      value.systemManaged !== true
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["systemManaged"],
        message:
          "Owner role must be system-managed.",
      });
    }
  });

export const updateRoleSchema = z
  .object({
    name: roleNameSchema.optional(),
    description: roleDescriptionSchema.optional(),
    scope: roleScopeSchema.optional(),
    status: roleStatusSchema.optional(),
  })
  .strict();

export const roleListQuerySchema = z
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

    scope: roleScopeSchema.optional(),

    status: roleStatusSchema.optional(),

    search: z
      .string()
      .trim()
      .max(200)
      .optional(),
  })
  .strict();

export type CreateRoleRequest = z.infer<
  typeof createRoleSchema
>;

export type UpdateRoleRequest = z.infer<
  typeof updateRoleSchema
>;

export type RoleListQueryRequest = z.infer<
  typeof roleListQuerySchema
>;
