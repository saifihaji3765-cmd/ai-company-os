import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535),

  DATABASE_URL: z.string().min(1),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),

  REDIS_URL: z.string().min(1),

  STORAGE_PROVIDER: z.enum(["s3"]).default("s3"),
  STORAGE_BUCKET: z.string().min(1),
  STORAGE_REGION: z.string().min(1),

  AI_PROVIDER: z.enum(["openai", "gemini"]).default("openai"),
  AI_API_KEY: z.string().min(1),

  JWT_ISSUER: z.string().min(1),
  JWT_AUDIENCE: z.string().min(1),
  JWT_ACCESS_TOKEN_TTL: z.string().min(1),

  ENCRYPTION_KEY: z.string().min(32),

  CORS_ORIGINS: z
    .string()
    .min(1)
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration.");

  for (const issue of parsedEnv.error.issues) {
    console.error(`${issue.path.join(".")}: ${issue.message}`);
  }

  process.exit(1);
}

export const env = Object.freeze(parsedEnv.data);
