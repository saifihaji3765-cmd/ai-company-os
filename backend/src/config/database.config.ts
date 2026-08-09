import { env } from "./env";

export const databaseConfig = Object.freeze({
  url: env.DATABASE_URL,

  connection: {
    applicationName: "ai-company-os-backend",
  },
});
