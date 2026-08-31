import type {
  AIMemory,
  AIMemoryImportance,
  AIMemoryType,
} from "./memory.types";

export interface AIMemoryStore {
  save(input: {
    readonly type: AIMemoryType;
    readonly content: string;
    readonly sourceId?: string;
    readonly importance: AIMemoryImportance;
    readonly relevance: number;
    readonly permissions?: readonly string[];
    readonly expiresAt?: string;
  }): Promise<AIMemory>;

  get(id: string): Promise<AIMemory | undefined>;

  list(type?: AIMemoryType): Promise<readonly AIMemory[]>;

  delete(id: string): Promise<void>;
}

export class InMemoryStore implements AIMemoryStore {
  private readonly memories = new Map<string, AIMemory>();

  public async save(input: {
    readonly type: AIMemoryType;
    readonly content: string;
    readonly sourceId?: string;
    readonly importance: AIMemoryImportance;
    readonly relevance: number;
    readonly permissions?: readonly string[];
    readonly expiresAt?: string;
  }): Promise<AIMemory> {
    if (input.relevance < 0 || input.relevance > 1) {
      throw new Error(
        "Memory relevance must be between 0 and 1.",
      );
    }

    const now = new Date().toISOString();

    const memory: AIMemory = {
      id: `memory-${Date.now()}`,
      type: input.type,
      content: input.content,
      sourceId: input.sourceId,
      importance: input.importance,
      relevance: input.relevance,
      permissions: input.permissions ?? [],
      version: 1,
      createdAt: now,
      updatedAt: now,
      expiresAt: input.expiresAt,
    };

    this.memories.set(memory.id, memory);

    return memory;
  }

  public async get(
    id: string,
  ): Promise<AIMemory | undefined> {
    return this.memories.get(id);
  }

  public async list(
    type?: AIMemoryType,
  ): Promise<readonly AIMemory[]> {
    const memories = Array.from(
      this.memories.values(),
    );

    if (!type) {
      return memories;
    }

    return memories.filter(
      (memory) => memory.type === type,
    );
  }

  public async delete(id: string): Promise<void> {
    this.memories.delete(id);
  }
}
