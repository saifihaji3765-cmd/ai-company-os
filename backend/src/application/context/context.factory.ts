import type {
  ApplicationContext,
  ApplicationContextSource,
} from "./application-context.types";

export interface CreateApplicationContextInput {
  readonly requestId: string;
  readonly correlationId?: string;
  readonly source: ApplicationContextSource;
  readonly startedAt?: string;
}

export function createApplicationContext(
  input: CreateApplicationContextInput,
): ApplicationContext {
  const requestId = input.requestId.trim();

  if (!requestId) {
    throw new Error(
      "Application context request ID is required.",
    );
  }

  const correlationId =
    input.correlationId?.trim() ||
    requestId;

  if (!correlationId) {
    throw new Error(
      "Application context correlation ID is required.",
    );
  }

  return Object.freeze({
    requestId,
    correlationId,
    source: input.source,
    startedAt:
      input.startedAt ??
      new Date().toISOString(),
  });
}
