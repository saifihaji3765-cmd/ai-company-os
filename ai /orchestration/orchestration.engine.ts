import type {
  AIExecutionContext,
  AIExecutionResult,
} from "./orchestration.types";

export interface AIOrchestrationEngine {
  execute(
    context: AIExecutionContext,
  ): Promise<AIExecutionResult>;
}

export class BasicOrchestrationEngine
  implements AIOrchestrationEngine
{
  public async execute(
    context: AIExecutionContext,
  ): Promise<AIExecutionResult> {
    return {
      missionId: context.missionId,
      status: "completed",
      output: undefined,
    };
  }
}
