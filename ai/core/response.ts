import type { AIExecutionId, AIRequestId } from "./types";

export interface AIResponse<T = unknown> {
  readonly requestId: AIRequestId;
  readonly executionId: AIExecutionId;
  readonly success: boolean;
  readonly data?: T;
  readonly error?: AIResponseError;
  readonly completedAt: string;
}

export interface AIResponseError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}
