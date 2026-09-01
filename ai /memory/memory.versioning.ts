import type { AIMemory } from "./memory.types";

export interface AIMemoryVersion {
  readonly memoryId: string;
  readonly version: number;
  readonly content: string;
  readonly createdAt: string;
}

export interface AIMemoryVersioning {
  createVersion(
    memory: AIMemory,
  ): Promise<AIMemoryVersion>;

  getHistory(
    memoryId: string,
  ): Promise<readonly AIMemoryVersion[]>;
}

export class BasicMemoryVersioning
  implements AIMemoryVersioning
{
  private readonly history =
    new Map<string, AIMemoryVersion[]>();

  public async createVersion(
    memory: AIMemory,
  ): Promise<AIMemoryVersion> {
    const version: AIMemoryVersion = {
      memoryId: memory.id,
      version: memory.version,
      content: memory.content,
      createdAt: new Date().toISOString(),
    };

    const versions =
      this.history.get(memory.id) ?? [];

    versions.push(version);

    this.history.set(memory.id, versions);

    return version;
  }

  public async getHistory(
    memoryId: string,
  ): Promise<readonly AIMemoryVersion[]> {
    return this.history.get(memoryId) ?? [];
  }
}
