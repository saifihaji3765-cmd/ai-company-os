export interface AIDecisionOption {
  readonly id: string;
  readonly description: string;
  readonly businessValue: number;
  readonly cost: number;
  readonly time: number;
  readonly technicalComplexity: number;
  readonly securityImpact: number;
  readonly risk: number;
  readonly expectedReturn: number;
  readonly maintainability: number;
}

export interface AIDecisionInput {
  readonly objective: string;
  readonly options: readonly AIDecisionOption[];
}

export interface AIDecisionResult {
  readonly objective: string;
  readonly selectedOptionId?: string;
  readonly score: number;
  readonly reasoning: readonly string[];
  readonly requiresHumanApproval: boolean;
}
