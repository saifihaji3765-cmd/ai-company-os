import type { AIMemory } from "./memory.types";

export interface AIMemoryAccessController {
  canRead(
    memory: AIMemory,
    actorId: string,
  ): Promise<boolean>;

  canWrite(
    memory: AIMemory,
    actorId: string,
  ): Promise<boolean>;

  canDelete(
    memory: AIMemory,
    actorId: string,
  ): Promise<boolean>;
}

export class BasicMemoryAccessController
  implements AIMemoryAccessController
{
  public async canRead(
    memory: AIMemory,
    actorId: string,
  ): Promise<boolean> {
    return (
      memory.permissions.length === 0 ||
      memory.permissions.includes(actorId)
    );
  }

  public async canWrite(
    memory: AIMemory,
    actorId: string,
  ): Promise<boolean> {
    return (
      memory.permissions.length === 0 ||
      memory.permissions.includes(actorId)
    );
  }

  public async canDelete(
    memory: AIMemory,
    actorId: string,
  ): Promise<boolean> {
    return (
      memory.permissions.length === 0 ||
      memory.permissions.includes(actorId)
    );
  }
}
