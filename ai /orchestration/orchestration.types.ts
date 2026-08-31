export type AIExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIExecutionContext {
  readonly missionId: string;
  readonly objective: string;
  readonly priority: string;
  readonly status: AIExecutionStatus;
}

export interface AIExecutionResult {
  readonly missionId: string;
  readonly status: AIExecutionStatus;
  readonly output?: unknown;
  readonly error?: string;
}
