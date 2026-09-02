export type CompanyBuilderStatus =
  | "idle"
  | "analyzing"
  | "planning"
  | "implementing"
  | "testing"
  | "validating"
  | "awaiting_approval"
  | "deploying"
  | "verifying"
  | "recovering"
  | "paused"
  | "completed"
  | "failed"
  | "emergency";

export type CompanyBuilderTaskType =
  | "analyze"
  | "plan"
  | "code"
  | "modify"
  | "test"
  | "validate"
  | "deploy"
  | "verify"
  | "recover";

export type CompanyBuilderRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type CompanyBuilderApprovalStatus =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected";

export interface CompanyBuilderRequirement {
  readonly id: string;
  readonly description: string;
  readonly sourceDocumentIds: readonly string[];
  readonly priority: "low" | "normal" | "high" | "critical";
  readonly constraints: readonly string[];
  readonly acceptanceCriteria: readonly string[];
}

export interface CompanyBuilderTask {
  readonly id: string;
  readonly type: CompanyBuilderTaskType;
  readonly description: string;
  readonly requirementIds: readonly string[];
  readonly dependencies: readonly string[];
  readonly capabilityIds: readonly string[];
  readonly risk: CompanyBuilderRisk;
  readonly approval: CompanyBuilderApprovalStatus;
}

export interface CompanyBuilderChange {
  readonly id: string;
  readonly taskId: string;
  readonly files: readonly string[];
  readonly description: string;
  readonly reason: string;
  readonly reversible: boolean;
}

export interface CompanyBuilderPlan {
  readonly id: string;
  readonly goal: string;
  readonly requirementIds: readonly string[];
  readonly tasks: readonly CompanyBuilderTask[];
  readonly expectedChanges: readonly CompanyBuilderChange[];
  readonly risk: CompanyBuilderRisk;
  readonly createdAt: string;
}

export interface CompanyBuilderExecution {
  readonly id: string;
  readonly planId: string;
  readonly status: CompanyBuilderStatus;
  readonly completedTaskIds: readonly string[];
  readonly failedTaskIds: readonly string[];
  readonly activeTaskId?: string;
  readonly startedAt: string;
  readonly updatedAt: string;
}

export interface CompanyBuilderResult {
  readonly executionId: string;
  readonly success: boolean;
  readonly changedFiles: readonly string[];
  readonly testResults: readonly string[];
  readonly validationIssues: readonly string[];
  readonly deploymentVerified: boolean;
}
