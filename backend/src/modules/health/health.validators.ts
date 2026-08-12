import { z } from "zod";

export const healthResponseSchema = z
  .object({
    status: z.enum([
      "healthy",
      "degraded",
      "unhealthy",
    ]),

    version: z.string().min(1),

    uptimeSeconds: z
      .number()
      .finite()
      .nonnegative(),

    checkedAt: z
      .string()
      .datetime({
        offset: true,
      }),

    checks: z.array(
      z.object({
        name: z.string().min(1),

        status: z.enum([
          "up",
          "down",
          "degraded",
        ]),

        latencyMs: z
          .number()
          .finite()
          .nonnegative(),

        message: z
          .string()
          .optional(),
      }).strict(),
    ),
  })
  .strict();

export type HealthResponseInput =
  z.infer<typeof healthResponseSchema>;
