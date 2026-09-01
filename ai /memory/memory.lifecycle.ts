import type { AIMemory } from "./memory.types";

export type AIMemoryLifecycleStatus =
  | "active"
  | "expired";

export interface AIMemoryLifecycle {
  getStatus(
    memory: AIMemory,
    now?: Date,
  ): AIMemoryLifecycleStatus;

  isExpired(
    memory: AIMemory,
    now?: Date,
  ): boolean;
}

export class BasicMemoryLifecycle
  implements AIMemoryLifecycle
{
  public getStatus(
    memory: AIMemory,
    now: Date = new Date(),
  ): AIMemoryLifecycleStatus {
    if (
      memory.expiresAt &&
      new Date(memory.expiresAt).getTime() <=
        now.getTime()
    ) {
      return "expired";
    }

    return "active";
  }

  public isExpired(
    memory: AIMemory,
    now: Date = new Date(),
  ): boolean {
    return this.getStatus(memory, now) === "expired";
  }
}
