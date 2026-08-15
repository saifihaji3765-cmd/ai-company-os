import type {
  AIProvider,
  AIProviderCapabilities,
} from "../contracts";
import type { RegisteredAIProvider } from "./provider-registry.types";

export class AIProviderRegistry {
  private readonly providers = new Map<string, RegisteredAIProvider>();

  register(
    provider: AIProvider,
    capabilities: AIProviderCapabilities,
  ): void {
    this.providers.set(provider.id, {
      provider,
      capabilities,
      enabled: true,
    });
  }

  unregister(providerId: string): boolean {
    return this.providers.delete(providerId);
  }

  get(providerId: string): RegisteredAIProvider | undefined {
    return this.providers.get(providerId);
  }

  list(): readonly RegisteredAIProvider[] {
    return Array.from(this.providers.values());
  }

  has(providerId: string): boolean {
    return this.providers.has(providerId);
  }

  setEnabled(providerId: string, enabled: boolean): boolean {
    const registered = this.providers.get(providerId);

    if (!registered) {
      return false;
    }

    this.providers.set(providerId, {
      ...registered,
      enabled,
    });

    return true;
  }
}
