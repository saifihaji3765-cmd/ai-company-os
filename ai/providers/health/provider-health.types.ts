export type AIProviderHealthStatus =
  | "healthy"
  | "degraded"
  | "unavailable"
  | "unknown";

export interface AIProviderHealth {
  readonly providerId: string;
  readonly status: AIProviderHealthStatus;
  readonly checkedAt: string;
  readonly latencyMs?: number;
  readonly error?: string;
}
