import { env } from "./env";

export const integrationConfig = Object.freeze({
  storage: {
    provider: env.STORAGE_PROVIDER,
    bucket: env.STORAGE_BUCKET,
    region: env.STORAGE_REGION,
  },

  ai: {
    provider: env.AI_PROVIDER,
  },
});
