import { env } from "./env";

export const aiConfig = Object.freeze({
  provider: env.AI_PROVIDER,

  apiKey: env.AI_API_KEY,
});
