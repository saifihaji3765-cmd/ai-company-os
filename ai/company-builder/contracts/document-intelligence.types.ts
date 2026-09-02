export type AIDocumentType =
  | "requirement"
  | "architecture"
  | "technical"
  | "business"
  | "policy"
  | "specification"
  | "unknown";

export type AIRequirementPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIRequirementStatus =
  | "identified"
  | "understood"
  | "ambiguous"
  | "conflicting"
  | "approved";

export interface AIDocumentSection {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly order: number;
  readonly parentId?: string;
}

export interface AIRequirement {
  readonly id: string;
  readonly statement: string;
  readonly priority: AIRequirementPriority;
  readonly status: AIRequirementStatus;
  readonly sourceDocumentId: string;
  readonly sourceSectionId?: string;
  readonly dependencies: readonly string[];
  readonly acceptanceCriteria: readonly string[];
}

export interface AIConstraint {
  readonly id: string;
  readonly statement: string;
  readonly sourceDocumentId: string;
  readonly severity: AIRequirementPriority;
}

export interface AIContradiction {
  readonly id: string;
  readonly requirementIds: readonly string[];
  readonly description: string;
  readonly severity: AIRequirementPriority;
  readonly resolved: boolean;
}

export interface AIOwnerQuestion {
  readonly id: string;
  readonly question: string;
  readonly reason: string;
  readonly relatedRequirementIds: readonly string[];
  readonly blocking: boolean;
}

export interface AIDocumentAnalysis {
  readonly documentId: string;
  readonly documentType: AIDocumentType;
  readonly title: string;
  readonly summary: string;
  readonly sections: readonly AIDocumentSection[];
  readonly requirements: readonly AIRequirement[];
  readonly constraints: readonly AIConstraint[];
  readonly contradictions: readonly AIContradiction[];
  readonly ownerQuestions: readonly AIOwnerQuestion[];
  readonly analyzedAt: string;
}
