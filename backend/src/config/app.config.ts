import { env } from "./env";

export const appConfig = Object.freeze({
  name: "AI Company OS",

  environment: env.NODE_ENV,

  server: {
    port: env.PORT,
  },

  cors: {
    origins: env.CORS_ORIGINS,
  },

  runtime: {
    isDevelopment: env.NODE_ENV === "development",
    isTest: env.NODE_ENV === "test",
    isStaging: env.NODE_ENV === "staging",
    isProduction: env.NODE_ENV === "production",
  },
});
