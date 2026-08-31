export type AITaskStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface AITask {
  readonly id: string;
  readonly missionId: string;
  readonly title: string;
  readonly description: string;
  readonly status: AITaskStatus;
  readonly dependencies: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
