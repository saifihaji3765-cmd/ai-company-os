import { z } from "zod";

export const permissionIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const permissionResourceSchema = z.enum([
  "organization",
  "workspace",
  "project",
  "agent",
  "mission",
  "workflow",
  "memory",
  "integration",
  "artifact",
  "system",
]);

export const permissionActionSchema = z.enum([
  "create",
  "read",
  "update",
  "delete",
  "execute",
  "manage",
]);

export const permissionScopeSchema = z.enum([
  "platform",
  "organization",
  "workspace",
  "project",
]);

export const permissionStatusSchema = z.enum([
  "active",
  "disabled",
]);

export const createPermissionSchema = z
  .object({
    resource: permissionResourceSchema,
    action: permissionActionSchema,
    scope: permissionScopeSchema,
    systemManaged: z.boolean(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.resource === "system" &&
      value.scope !== "platform"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scope"],
        message:
          "System permissions must use platform scope.",
      });
    }

    if (
      value.resource === "system" &&
      value.systemManaged !== true
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["systemManaged"],
        message:
          "System permissions must be system-managed.",
      });
    }
  });

export const updatePermissionSchema = z
  .object({
    status: permissionStatusSchema.optional(),
  })
  .strict();

export const permissionListQuerySchema = z
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

    resource:
      permissionResourceSchema.optional(),

    action:
      permissionActionSchema.optional(),

    scope:
      permissionScopeSchema.optional(),

    status:
      permissionStatusSchema.optional(),

    search: z
      .string()
      .trim()
      .max(200)
      .optional(),
  })
  .strict();

export type CreatePermissionRequest =
  z.infer<typeof createPermissionSchema>;

export type UpdatePermissionRequest =
  z.infer<typeof updatePermissionSchema>;

export type PermissionListQueryRequest =
  z.infer<typeof permissionListQuerySchema>;
