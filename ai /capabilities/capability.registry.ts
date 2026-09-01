import type {
  AICapability,
  AICapabilityStatus,
} from "./capability.types";

export class AICapabilityRegistry {
  private readonly capabilities =
    new Map<string, AICapability>();

  public register(
    capability: AICapability,
  ): void {
    this.validateCapability(capability);

    if (this.capabilities.has(capability.id)) {
      throw new Error(
        `Capability already registered: ${capability.id}`,
      );
    }

    this.capabilities.set(
      capability.id,
      capability,
    );
  }

  public get(
    id: string,
  ): AICapability | undefined {
    return this.capabilities.get(id);
  }

  public list(): readonly AICapability[] {
    return Array.from(
      this.capabilities.values(),
    );
  }

  public disable(
    id: string,
  ): void {
    this.updateStatus(id, "disabled");
  }

  public updateStatus(
    id: string,
    status: AICapabilityStatus,
  ): void {
    const capability =
      this.capabilities.get(id);

    if (!capability) {
      throw new Error(
        `Capability not found: ${id}`,
      );
    }

    this.capabilities.set(id, {
      ...capability,
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  public has(id: string): boolean {
    return this.capabilities.has(id);
  }

  public isActive(id: string): boolean {
    const capability =
      this.capabilities.get(id);

    return capability?.status === "active";
  }

  public canExecute(id: string): boolean {
    const capability =
      this.capabilities.get(id);

    if (!capability) {
      return false;
    }

    return capability.status === "active";
  }

  private validateCapability(
    capability: AICapability,
  ): void {
    if (!capability.id.trim()) {
      throw new Error(
        "Capability id is required.",
      );
    }

    if (!capability.name.trim()) {
      throw new Error(
        "Capability name is required.",
      );
    }

    if (!capability.description.trim()) {
      throw new Error(
        "Capability description is required.",
      );
    }

    if (!capability.version.trim()) {
      throw new Error(
        "Capability version is required.",
      );
    }

    if (!capability.owner.trim()) {
      throw new Error(
        "Capability owner is required.",
      );
    }

    if (!Array.isArray(capability.inputs)) {
      throw new Error(
        "Capability inputs must be an array.",
      );
    }

    if (!Array.isArray(capability.outputs)) {
      throw new Error(
        "Capability outputs must be an array.",
      );
    }

    if (!Array.isArray(capability.dependencies)) {
      throw new Error(
        "Capability dependencies must be an array.",
      );
    }

    if (!Array.isArray(capability.permissions)) {
      throw new Error(
        "Capability permissions must be an array.",
      );
    }
  }
}
