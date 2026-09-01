export type ChiefAIStatus =
  | "initializing"
  | "ready"
  | "thinking"
  | "executing"
  | "paused"
  | "emergency"
  | "shutdown";

export type ChiefAIIntent =
  | "analyze"
  | "plan"
  | "decide"
  | "execute"
  | "monitor"
  | "recover"
  | "escalate";

export type ChiefAIPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export interface ChiefAIRequest {
  readonly id: string;
  readonly goal: string;
  readonly intent: ChiefAIIntent;
  readonly priority: ChiefAIPriority;
  readonly requestedBy: string;
  readonly createdAt: string;
  readonly context?: Readonly<Record<string, unknown>>;
}

export interface ChiefAIDecision {
  readonly id: string;
  readonly requestId: string;
  readonly decision: string;
  readonly reasoningSummary: string;
  readonly requiredCapabilities: readonly string[];
  readonly requiresApproval: boolean;
  readonly approved: boolean;
  readonly createdAt: string;
}

export interface ChiefAIAuthority {
  readonly canAnalyze: boolean;
  readonly canPlan: boolean;
  readonly canDecide: boolean;
  readonly canExecute: boolean;
  readonly canRequestApproval: boolean;
  readonly canTriggerRecovery: boolean;
  readonly canEnterEmergencyMode: boolean;
}

export interface ChiefAIState {
  readonly status: ChiefAIStatus;
  readonly activeRequestId?: string;
  readonly activeDecisionId?: string;
  readonly lastUpdatedAt: string;
}

export interface ChiefAIConfig {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly authority: ChiefAIAuthority;
  readonly maxConcurrentTasks: number;
  readonly requireApprovalForHighRisk: boolean;
  readonly requireCapabilityRegistration: boolean;
}
