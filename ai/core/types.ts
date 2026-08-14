export type AIRequestId = string & {
  readonly __brand: "AIRequestId";
};

export type AIExecutionId = string & {
  readonly __brand: "AIExecutionId";
};

export type AIProviderId = string & {
  readonly __brand: "AIProviderId";
};

export type AIRequestSource =
  | "owner"
  | "agent"
  | "mission"
  | "workflow"
  | "system";
