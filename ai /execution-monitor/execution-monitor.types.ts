export type AIExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "paused";

export interface AIExecutionRecord {
  readonly id: string;
  readonly missionId: string;
  readonly taskId: string;
  readonly status: AIExecutionStatus;
  readonly startedAt?: string;
  readonly completedAt?: string;
  readonly output?: unknown;
  readonly error?: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}
