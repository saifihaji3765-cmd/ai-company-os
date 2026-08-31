export interface AIPlanningInput {
  readonly objective: string;
  readonly constraints?: readonly string[];
  readonly availableResources?: readonly string[];
}

export interface AIPlanTask {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly dependencies: readonly string[];
}

export interface AIPlan {
  readonly id: string;
  readonly objective: string;
  readonly tasks: readonly AIPlanTask[];
}
