import type { AIMemory } from "./memory.types";

export interface AIMemoryIndex {
  add(memory: AIMemory): Promise<void>;

  remove(id: string): Promise<void>;

  search(
    query: string,
  ): Promise<readonly AIMemory[]>;
}

export class BasicMemoryIndex
  implements AIMemoryIndex
{
  private readonly memories =
    new Map<string, AIMemory>();

  public async add(
    memory: AIMemory,
  ): Promise<void> {
    this.memories.set(memory.id, memory);
  }

  public async remove(
    id: string,
  ): Promise<void> {
    this.memories.delete(id);
  }

  public async search(
    query: string,
  ): Promise<readonly AIMemory[]> {
    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    const terms = normalizedQuery.split(/\s+/);

    return Array.from(
      this.memories.values(),
    ).filter((memory) => {
      const content =
        memory.content.toLowerCase();

      return terms.some((term) =>
        content.includes(term),
      );
    });
  }
}
