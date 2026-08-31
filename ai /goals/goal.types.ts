export type AIGoalPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type AIGoalStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIGoal {
  readonly id: string;
  readonly objective: string;
  readonly priority: AIGoalPriority;
  readonly deadline?: string;
  readonly businessValue: string;
  readonly successCriteria: readonly string[];
  readonly progress: number;
  readonly status: AIGoalStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}
