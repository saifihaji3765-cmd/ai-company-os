export type AIMissionPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type AIMissionStatus =
  | "pending"
  | "planning"
  | "running"
  | "validating"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIMission {
  readonly id: string;
  readonly priority: AIMissionPriority;
  readonly objective: string;
  readonly successCriteria: readonly string[];
  readonly riskLevel: string;
  readonly status: AIMissionStatus;
  readonly executionHistory: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
