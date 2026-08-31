import type { AIMemory, AIMemoryCategory } from "./memory.types";

export class AIMemoryStore {
  private readonly memories = new Map<string, AIMemory>();

  public save(memory: AIMemory): void {
    this.memories.set(memory.id, memory);
  }

  public get(id: string): AIMemory | undefined {
    return this.memories.get(id);
  }

  public findByCategory(
    category: AIMemoryCategory,
  ): readonly AIMemory[] {
    return Array.from(this.memories.values()).filter(
      (memory) => memory.category === category,
    );
  }

  public delete(id: string): boolean {
    return this.memories.delete(id);
  }

  public list(): readonly AIMemory[] {
    return Array.from(this.memories.values());
  }
}
