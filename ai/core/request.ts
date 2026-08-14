import type { AIExecutionContext } from "./context";
import type { AIRequestId } from "./types";

export interface AIRequest {
  readonly id: AIRequestId;
  readonly input: string;
  readonly context: AIExecutionContext;
}
