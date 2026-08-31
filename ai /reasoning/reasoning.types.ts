export interface AIReasoningInput {
  readonly objective: string;
  readonly context?: Record<string, unknown>;
  readonly constraints?: readonly string[];
}

export interface AIReasoningResult {
  readonly conclusion: string;
  readonly confidence: number;
  readonly factors: readonly string[];
  readonly risks: readonly string[];
}
