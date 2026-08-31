import type {
  AILearning,
  AILearningType,
} from "./learning.types";

export interface AILearningEngine {
  record(
    input: {
      readonly type: AILearningType;
      readonly sourceId: string;
      readonly lesson: string;
      readonly confidence: number;
    },
  ): Promise<AILearning>;
}

export class BasicLearningEngine
  implements AILearningEngine
{
  public async record(
    input: {
      readonly type: AILearningType;
      readonly sourceId: string;
      readonly lesson: string;
      readonly confidence: number;
    },
  ): Promise<AILearning> {
    return {
      id: `learning-${Date.now()}`,
      type: input.type,
      sourceId: input.sourceId,
      lesson: input.lesson,
      confidence: input.confidence,
      createdAt: new Date().toISOString(),
    };
  }
}
