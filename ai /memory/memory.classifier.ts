import type {
  AIMemory,
  AIMemoryImportance,
  AIMemoryType,
} from "./memory.types";

export interface AIMemoryClassifier {
  classify(input: {
    readonly content: string;
    readonly sourceId?: string;
    readonly importance?: AIMemoryImportance;
  }): Promise<Pick<AIMemory, "type" | "importance">>;
}

export class BasicMemoryClassifier
  implements AIMemoryClassifier
{
  public async classify(input: {
    readonly content: string;
    readonly sourceId?: string;
    readonly importance?: AIMemoryImportance;
  }): Promise<Pick<AIMemory, "type" | "importance">> {
    const importance =
      input.importance ?? "normal";

    return {
      type: "long_term",
      importance,
    };
  }
}
