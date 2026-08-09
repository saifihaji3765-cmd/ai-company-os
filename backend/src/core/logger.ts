import pino, { type Logger } from "pino";

import { loggingConfig } from "../config";

export type AppLogger = Logger;

export function createLogger(
  bindings: Record<string, unknown> = {},
): AppLogger {
  return pino({
    level: loggingConfig.level,

    base: {
      service: loggingConfig.service.name,
      environment: loggingConfig.service.environment,
      ...bindings,
    },

    formatters: {
      level: (label) => ({
        level: label,
      }),
    },

    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

export const logger = createLogger();
