import type {
  AIDecisionInput,
  AIDecisionResult,
} from "./decision.types";

export interface AIDecisionEngine {
  evaluate(
    input: AIDecisionInput,
  ): Promise<AIDecisionResult>;
}

export class BasicDecisionEngine
  implements AIDecisionEngine
{
  public async evaluate(
    input: AIDecisionInput,
  ): Promise<AIDecisionResult> {
    if (input.options.length === 0) {
      return {
        objective: input.objective,
        score: 0,
        reasoning: ["No decision options were provided."],
        requiresHumanApproval: true,
      };
    }

    const scoredOptions = input.options.map((option) => {
      const score =
        option.businessValue +
        option.expectedReturn +
        option.maintainability -
        option.cost -
        option.time -
        option.technicalComplexity -
        option.securityImpact -
        option.risk;

      return {
        option,
        score,
      };
    });

    scoredOptions.sort(
      (a, b) => b.score - a.score,
    );

    const selected = scoredOptions[0];

    return {
      objective: input.objective,
      selectedOptionId: selected.option.id,
      score: selected.score,
      reasoning: [
        "Option selected using the configured decision factors.",
      ],
      requiresHumanApproval: true,
    };
  }
}
