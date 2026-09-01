export type AIRecoveryStrategy =
  | "retry"
  | "rollback"
  | "pause"
  | "escalate";

export type AIRecoveryStatus =
  | "pending"
  | "in_progress"
  | "recovered"
  | "failed"
  | "escalated";

export interface AIRecoveryRequest {
  readonly id: string;
  readonly executionId: string;
  readonly strategy: AIRecoveryStrategy;
  readonly status: AIRecoveryStatus;
  readonly reason: string;
  readonly attempt: number;
  readonly createdAt: string;
  readonly completedAt?: string;
}
