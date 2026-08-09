import { env } from "./env";

export const queueConfig = Object.freeze({
  redis: {
    url: env.REDIS_URL,
  },

  jobs: {
    defaultAttempts: 3,
  },

  worker: {
    concurrency: 10,
  },
});
