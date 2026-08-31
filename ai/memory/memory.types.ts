export type AIMemoryCategory =
  | "owner_preference"
  | "business_rule"
  | "active_mission"
  | "completed_mission"
  | "approved_decision"
  | "capability_history"
  | "lesson_learned";

export interface AIMemory {
  readonly id: string;
  readonly category: AIMemoryCategory;
  readonly key: string;
  readonly value: unknown;
  readonly createdAt: string;
  readonly updatedAt: string;
}
