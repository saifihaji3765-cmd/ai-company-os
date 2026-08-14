import type {
  AIExecutionId,
  AIRequestId,
  AIRequestSource,
} from "./types";

export interface AIExecutionContext {
  readonly requestId: AIRequestId;
  readonly executionId: AIExecutionId;
  readonly source: AIRequestSource;
  readonly createdAt: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}
