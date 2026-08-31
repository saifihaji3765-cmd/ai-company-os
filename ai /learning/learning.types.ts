export type AILearningType =
  | "success"
  | "failure"
  | "optimization"
  | "pattern";

export interface AILearning {
  readonly id: string;
  readonly type: AILearningType;
  readonly sourceId: string;
  readonly lesson: string;
  readonly confidence: number;
  readonly createdAt: string;
}
