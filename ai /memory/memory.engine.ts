import type {
  AIMemory,
  AIMemoryImportance,
  AIMemoryType,
} from "./memory.types";

import type { AIMemoryStore } from "./memory.store";
import type { AIMemoryClassifier } from "./memory.classifier";
import type { AIMemoryValidator } from "./memory.validator";
import type { AIMemoryIndex } from "./memory.index";
import type { AIMemoryAccessController } from "./memory.access";
import type { AIMemoryLifecycle } from "./memory.lifecycle";
import type { AIMemoryDeduplication } from "./memory.deduplication";

export interface AIMemoryEngine {
  remember(input: {
    readonly content: string;
    readonly type?: AIMemoryType;
    readonly importance?: AIMemoryImportance;
    readonly sourceId?: string;
    readonly permissions?: readonly string[];
    readonly expiresAt?: string;
  }): Promise<AIMemory>;

  recall(
    query: string,
    actorId?: string,
  ): Promise<readonly AIMemory[]>;

  forget(
    id: string,
    actorId?: string,
  ): Promise<void>;
}

export class BasicMemoryEngine
  implements AIMemoryEngine
{
  public constructor(
    private readonly store: AIMemoryStore,
    private readonly classifier: AIMemoryClassifier,
    private readonly validator: AIMemoryValidator,
    private readonly index: AIMemoryIndex,
    private readonly access: AIMemoryAccessController,
    private readonly lifecycle: AIMemoryLifecycle,
    private readonly deduplication: AIMemoryDeduplication,
  ) {}

  public async remember(input: {
    readonly content: string;
    readonly type?: AIMemoryType;
    readonly importance?: AIMemoryImportance;
    readonly sourceId?: string;
    readonly permissions?: readonly string[];
    readonly expiresAt?: string;
  }): Promise<AIMemory> {
    if (!input.content.trim()) {
      throw new Error(
        "Memory content cannot be empty.",
      );
    }

    const classification =
      await this.classifier.classify({
        content: input.content,
        sourceId: input.sourceId,
        importance: input.importance,
      });

    const memory = await this.store.save({
      type: input.type ?? classification.type,
      content: input.content,
      sourceId: input.sourceId,
      importance:
        input.importance ?? classification.importance,
      relevance: 1,
      permissions: input.permissions,
      expiresAt: input.expiresAt,
    });

    const validation =
      await this.validator.validate(memory);

    if (!validation.valid) {
      await this.store.delete(memory.id);

      throw new Error(
        `Invalid memory: ${validation.issues.join("; ")}`,
      );
    }

    const existing = await this.store.list(
      memory.type,
    );

    if (
      await this.deduplication.isDuplicate(
        memory,
        existing,
      )
    ) {
      await this.store.delete(memory.id);

      throw new Error(
        "Duplicate memory detected.",
      );
    }

    await this.index.add(memory);

    return memory;
  }

  public async recall(
    query: string,
    actorId?: string,
  ): Promise<readonly AIMemory[]> {
    const candidates =
      await this.index.search(query);

    const results: AIMemory[] = [];

    for (const memory of candidates) {
      if (
        this.lifecycle.isExpired(memory)
      ) {
        continue;
      }

      if (actorId) {
        const allowed =
          await this.access.canRead(
            memory,
            actorId,
          );

        if (!allowed) {
          continue;
        }
      }

      results.push(memory);
    }

    return results;
  }

  public async forget(
    id: string,
    actorId?: string,
  ): Promise<void> {
    const memory = await this.store.get(id);

    if (!memory) {
      throw new Error(
        `Memory not found: ${id}`,
      );
    }

    if (actorId) {
      const allowed =
        await this.access.canDelete(
          memory,
          actorId,
        );

      if (!allowed) {
        throw new Error(
          "Memory deletion is not authorized.",
        );
      }
    }

    await this.index.remove(id);
    await this.store.delete(id);
  }
}
