export type AIValidationStatus =
  | "passed"
  | "failed"
  | "needs_review";

export interface AIValidationInput {
  readonly taskId: string;
  readonly output: unknown;
  readonly successCriteria: readonly string[];
}

export interface AIValidationResult {
  readonly taskId: string;
  readonly status: AIValidationStatus;
  readonly score: number;
  readonly issues: readonly string[];
}
