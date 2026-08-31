export type AIKnowledgeCategory =
  | "business"
  | "engineering"
  | "marketing"
  | "client"
  | "research"
  | "policy"
  | "documentation";

export interface AIKnowledgeItem {
  readonly id: string;
  readonly category: AIKnowledgeCategory;
  readonly title: string;
  readonly content: string;
  readonly source?: string;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
