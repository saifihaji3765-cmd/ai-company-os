import type { AIMemory } from "./memory.types";

export interface AIMemoryDeduplication {
  isDuplicate(
    memory: AIMemory,
    existing: readonly AIMemory[],
  ): Promise<boolean>;
}

export class BasicMemoryDeduplication
  implements AIMemoryDeduplication
{
  public async isDuplicate(
    memory: AIMemory,
    existing: readonly AIMemory[],
  ): Promise<boolean> {
    const normalizedContent =
      memory.content.trim().toLowerCase();

    if (!normalizedContent) {
      return false;
    }

    return existing.some(
      (candidate) =>
        candidate.id !== memory.id &&
        candidate.content.trim().toLowerCase() ===
          normalizedContent,
    );
  }
}
