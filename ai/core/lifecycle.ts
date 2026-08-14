export type AIExecutionStatus =
  | "created"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIExecutionLifecycle {
  readonly status: AIExecutionStatus;
  readonly startedAt?: string;
  readonly completedAt?: string;
  readonly failureReason?: string;
}
