import type {
  AIProviderHealth,
  AIProviderHealthStatus,
} from "./provider-health.types";

export class AIProviderHealthService {
  private readonly health = new Map<string, AIProviderHealth>();

  public setHealth(
    providerId: string,
    status: AIProviderHealthStatus,
    latencyMs?: number,
    error?: string,
  ): AIProviderHealth {
    const result: AIProviderHealth = {
      providerId,
      status,
      checkedAt: new Date().toISOString(),
      ...(latencyMs !== undefined ? { latencyMs } : {}),
      ...(error !== undefined ? { error } : {}),
    };

    this.health.set(providerId, result);

    return result;
  }

  public getHealth(
    providerId: string,
  ): AIProviderHealth | undefined {
    return this.health.get(providerId);
  }

  public isAvailable(providerId: string): boolean {
    const result = this.health.get(providerId);

    return (
      result?.status === "healthy" ||
      result?.status === "degraded"
    );
  }
}
