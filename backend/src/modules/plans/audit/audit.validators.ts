import { z } from "zod";

export const auditEventIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const organizationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const auditActorTypeSchema = z.enum([
  "owner",
  "user",
  "ai_agent",
  "automation",
  "system",
]);

export const auditActionSchema = z.enum([
  "create",
  "read",
  "update",
  "delete",
  "execute",
  "login",
  "logout",
  "authorize",
  "deny",
]);

export const auditResourceSchema = z.enum([
  "user",
  "organization",
  "workspace",
  "project",
  "role",
  "permission",
  "plan",
  "subscription",
  "usage",
  "agent",
  "mission",
  "workflow",
  "memory",
  "integration",
  "system",
]);

export const auditOutcomeSchema = z.enum([
  "success",
  "failure",
  "denied",
]);

export const isoDateSchema = z
  .string()
  .datetime({
    offset: true,
  });

export const auditMetadataSchema =
  z.record(z.string(), z.unknown());

export const createAuditEventSchema = z
  .object({
    organizationId:
      organizationIdSchema.nullable(),

    actorId:
      z.string()
        .trim()
        .min(1)
        .max(128)
        .nullable(),

    actorType:
      auditActorTypeSchema,

    action:
      auditActionSchema,

    resource:
      auditResourceSchema,

    resourceId:
      z.string()
        .trim()
        .min(1)
        .max(128)
        .nullable(),

    outcome:
      auditOutcomeSchema,

    metadata:
      auditMetadataSchema.optional(),

    occurredAt:
      isoDateSchema,
  })
  .strict();

export const auditQuerySchema = z
  .object({
    organizationId:
      organizationIdSchema.optional(),

    actorId:
      z.string()
        .trim()
        .min(1)
        .max(128)
        .optional(),

    actorType:
      auditActorTypeSchema.optional(),

    action:
      auditActionSchema.optional(),

    resource:
      auditResourceSchema.optional(),

    resourceId:
      z.string()
        .trim()
        .min(1)
        .max(128)
        .optional(),

    outcome:
      auditOutcomeSchema.optional(),

    from:
      isoDateSchema.optional(),

    to:
      isoDateSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.from &&
      value.to &&
      value.to < value.from
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message:
          "The end date cannot precede the start date.",
      });
    }
  });

export const auditListQuerySchema =
  auditQuerySchema
    .extend({
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
    })
    .strict();

export type CreateAuditEventRequest =
  z.infer<
    typeof createAuditEventSchema
  >;

export type AuditQueryRequest =
  z.infer<
    typeof auditQuerySchema
  >;

export type AuditListQueryRequest =
  z.infer<
    typeof auditListQuerySchema
  >;
