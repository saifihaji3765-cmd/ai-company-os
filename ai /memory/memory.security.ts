import type { AIMemory } from "./memory.types";

export type AIMemorySecurityLevel =
  | "public"
  | "internal"
  | "sensitive"
  | "critical";

export interface AIMemorySecurity {
  classify(
    memory: AIMemory,
  ): Promise<AIMemorySecurityLevel>;

  requiresProtection(
    memory: AIMemory,
  ): Promise<boolean>;
}

export class BasicMemorySecurity
  implements AIMemorySecurity
{
  public async classify(
    memory: AIMemory,
  ): Promise<AIMemorySecurityLevel> {
    if (memory.importance === "critical") {
      return "critical";
    }

    if (memory.permissions.length > 0) {
      return "sensitive";
    }

    if (memory.importance === "high") {
      return "internal";
    }

    return "public";
  }

  public async requiresProtection(
    memory: AIMemory,
  ): Promise<boolean> {
    const level = await this.classify(memory);

    return (
      level === "sensitive" ||
      level === "critical"
    );
  }
}
