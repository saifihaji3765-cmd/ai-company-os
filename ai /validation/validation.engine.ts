import type {
  AIValidationInput,
  AIValidationResult,
} from "./validation.types";

export interface AIValidationEngine {
  validate(
    input: AIValidationInput,
  ): Promise<AIValidationResult>;
}

export class BasicValidationEngine
  implements AIValidationEngine
{
  public async validate(
    input: AIValidationInput,
  ): Promise<AIValidationResult> {
    if (input.output === undefined || input.output === null) {
      return {
        taskId: input.taskId,
        status: "failed",
        score: 0,
        issues: ["Task produced no output."],
      };
    }

    return {
      taskId: input.taskId,
      status: "needs_review",
      score: 0,
      issues: [
        "Automated validation criteria have not been configured yet.",
      ],
    };
  }
}
