import type {
  AIPlan,
  AIPlanningInput,
} from "./planning.types";

export interface AIPlanningEngine {
  createPlan(input: AIPlanningInput): Promise<AIPlan>;
}

export class BasicPlanningEngine implements AIPlanningEngine {
  public async createPlan(
    input: AIPlanningInput,
  ): Promise<AIPlan> {
    return {
      id: `plan-${Date.now()}`,
      objective: input.objective,
      tasks: [],
    };
  }
}
