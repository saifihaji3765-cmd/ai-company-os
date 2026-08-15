export type AIProviderStatus =
  | "active"
  | "inactive"
  | "degraded"
  | "unavailable";

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly status: AIProviderStatus;
}
