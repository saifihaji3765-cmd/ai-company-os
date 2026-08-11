import { z } from "zod";

export const planIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const planKeySchema = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
    "Plan key must contain lowercase letters, numbers, and underscores only.",
  );

export const planNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(100);

export const planDescriptionSchema = z
  .string()
  .trim()
  .min(1)
  .max(500);

export const planScopeSchema = z.enum([
  "platform",
  "organization",
  "workspace",
  "project",
]);

export const planStatusSchema = z.enum([
  "active",
  "disabled",
  "archived",
]);

export const planCapabilitiesSchema = z
  .object({
    aiExecution: z.boolean(),
    agentExecution: z.boolean(),
    workflowExecution: z.boolean(),
    memory: z.boolean(),
    integrations: z.boolean(),
    automation: z.boolean(),
  })
  .strict();

const planLimitSchema = z
  .number()
  .int()
  .min(0)
  .nullable();

export const planLimitsSchema = z
  .object({
    maxProjects: planLimitSchema,
    maxAgents: planLimitSchema,
    maxConcurrentAgents: planLimitSchema,
    maxMissions: planLimitSchema,
    maxConcurrentMissions: planLimitSchema,
    maxWorkflows: planLimitSchema,
    maxMemoryEntries: planLimitSchema,
    maxStorageBytes: planLimitSchema,
  })
  .strict();

export const createPlanSchema = z
  .object({
    key: planKeySchema,
    name: planNameSchema,
    description: planDescriptionSchema,
    scope: planScopeSchema,
    capabilities: planCapabilitiesSchema,
    limits: planLimitsSchema,
    systemManaged: z.boolean(),
  })
  .strict();

export const updatePlanSchema = z
  .object({
    name: planNameSchema.optional(),
    description: planDescriptionSchema.optional(),
    status: planStatusSchema.optional(),
    capabilities:
      planCapabilitiesSchema.optional(),
    limits: planLimitsSchema.optional(),
  })
  .strict();

export const planListQuerySchema = z
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

    scope: planScopeSchema.optional(),

    status: planStatusSchema.optional(),

    search: z
      .string()
      .trim()
      .max(200)
      .optional(),
  })
  .strict();

export type CreatePlanRequest = z.infer<
  typeof createPlanSchema
>;

export type UpdatePlanRequest = z.infer<
  typeof updatePlanSchema
>;

export type PlanListQueryRequest = z.infer<
  typeof planListQuerySchema
>;
