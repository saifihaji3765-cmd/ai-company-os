import type { AIMemory } from "./memory.types";

export interface AIMemoryRelevanceEngine {
  calculate(input: {
    readonly memory: AIMemory;
    readonly query: string;
  }): Promise<number>;
}

export class BasicMemoryRelevanceEngine
  implements AIMemoryRelevanceEngine
{
  public async calculate(input: {
    readonly memory: AIMemory;
    readonly query: string;
  }): Promise<number> {
    const memoryWords = new Set(
      input.memory.content
        .toLowerCase()
        .split(/\s+/),
    );

    const queryWords = input.query
      .toLowerCase()
      .split(/\s+/);

    if (queryWords.length === 0) {
      return 0;
    }

    const matches = queryWords.filter((word) =>
      memoryWords.has(word),
    ).length;

    return Math.min(
      matches / queryWords.length,
      1,
    );
  }
}
