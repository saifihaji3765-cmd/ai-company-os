import { env } from "./env";

export const securityConfig = Object.freeze({
  jwt: {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    accessTokenTtl: env.JWT_ACCESS_TOKEN_TTL,
  },

  encryption: {
    key: env.ENCRYPTION_KEY,
  },

  cors: {
    allowedOrigins: env.CORS_ORIGINS,
  },
});
