import type { AICapability } from "./capability.types";

export class AICapabilityRegistry {
  private readonly capabilities = new Map<string, AICapability>();

  public register(capability: AICapability): void {
    if (this.capabilities.has(capability.id)) {
      throw new Error(
        `Capability already registered: ${capability.id}`,
      );
    }

    this.capabilities.set(capability.id, capability);
  }

  public get(id: string): AICapability | undefined {
    return this.capabilities.get(id);
  }

  public list(): readonly AICapability[] {
    return Array.from(this.capabilities.values());
  }

  public disable(id: string): void {
    const capability = this.capabilities.get(id);

    if (!capability) {
      throw new Error(`Capability not found: ${id}`);
    }

    this.capabilities.set(id, {
      ...capability,
      status: "disabled",
    });
  }
}
