import { env } from "./env";

export const loggingConfig = Object.freeze({
  level: env.LOG_LEVEL,

  service: {
    name: "ai-company-os-backend",
    environment: env.NODE_ENV,
  },

  format: {
    type: "json" as const,
  },
});
