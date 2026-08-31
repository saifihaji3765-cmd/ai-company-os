import type {
  AIReasoningInput,
  AIReasoningResult,
} from "./reasoning.types";

export interface AIReasoningEngine {
  reason(input: AIReasoningInput): Promise<AIReasoningResult>;
}

export class BasicReasoningEngine implements AIReasoningEngine {
  public async reason(
    input: AIReasoningInput,
  ): Promise<AIReasoningResult> {
    const factors = Object.keys(input.context ?? {});

    return {
      conclusion: `Reasoning required for objective: ${input.objective}`,
      confidence: 0,
      factors,
      risks: [],
    };
  }
}
