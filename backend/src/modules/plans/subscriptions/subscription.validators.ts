import { z } from "zod";

export const subscriptionIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const organizationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const planIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const subscriptionStatusSchema =
  z.enum([
    "active",
    "paused",
    "expired",
    "cancelled",
  ]);

export const isoDateSchema = z
  .string()
  .datetime({
    offset: true,
  });

export const createSubscriptionSchema = z
  .object({
    organizationId: organizationIdSchema,
    planId: planIdSchema,
    startsAt: isoDateSchema,
    endsAt: isoDateSchema.nullable(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.endsAt !== null &&
      value.endsAt < value.startsAt
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message:
          "Subscription end date cannot precede its start date.",
      });
    }
  });

export const updateSubscriptionSchema = z
  .object({
    status:
      subscriptionStatusSchema.optional(),

    endsAt:
      isoDateSchema.nullable().optional(),
  })
  .strict();

export const subscriptionListQuerySchema = z
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

    status:
      subscriptionStatusSchema.optional(),

    planId:
      planIdSchema.optional(),
  })
  .strict();

export type CreateSubscriptionRequest =
  z.infer<
    typeof createSubscriptionSchema
  >;

export type UpdateSubscriptionRequest =
  z.infer<
    typeof updateSubscriptionSchema
  >;

export type SubscriptionListQueryRequest =
  z.infer<
    typeof subscriptionListQuerySchema
  >;
