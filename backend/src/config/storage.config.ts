import { env } from "./env";

export const storageConfig = Object.freeze({
  provider: env.STORAGE_PROVIDER,

  bucket: env.STORAGE_BUCKET,

  region: env.STORAGE_REGION,
});
