import { z } from "zod";

export const usageRecordIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const organizationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const usageResourceSchema = z.enum([
  "agent_execution",
  "mission_execution",
  "workflow_execution",
  "memory_entry",
  "storage",
  "api_request",
]);

export const usageUnitSchema = z.enum([
  "count",
  "bytes",
  "requests",
]);

export const isoDateSchema = z
  .string()
  .datetime({
    offset: true,
  });

export const recordUsageSchema = z
  .object({
    organizationId: organizationIdSchema,
    resource: usageResourceSchema,
    unit: usageUnitSchema,
    quantity: z
      .number()
      .finite()
      .positive(),
    occurredAt: isoDateSchema,
  })
  .strict();

export const usageQuerySchema = z
  .object({
    organizationId: organizationIdSchema,
    resource: usageResourceSchema.optional(),
    unit: usageUnitSchema.optional(),
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
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

export const usageListQuerySchema = z
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

    resource:
      usageResourceSchema.optional(),

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

export type RecordUsageRequest =
  z.infer<typeof recordUsageSchema>;

export type UsageQueryRequest =
  z.infer<typeof usageQuerySchema>;

export type UsageListQueryRequest =
  z.infer<typeof usageListQuerySchema>;
