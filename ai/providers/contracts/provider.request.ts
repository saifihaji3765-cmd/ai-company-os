import type { AIExecutionContext } from "../../core/context";

export interface AIProviderRequest {
  readonly model: string;
  readonly input: string;
  readonly context: AIExecutionContext;
  readonly parameters?: Readonly<Record<string, unknown>>;
}
