export type AIMemoryType =
  | "short_term"
  | "long_term"
  | "mission"
  | "knowledge";

export type AIMemoryImportance =
  | "low"
  | "normal"
  | "high"
  | "critical";

export interface AIMemory {
  readonly id: string;
  readonly type: AIMemoryType;
  readonly content: string;
  readonly sourceId?: string;
  readonly importance: AIMemoryImportance;
  readonly relevance: number;
  readonly permissions: readonly string[];
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly expiresAt?: string;
}
