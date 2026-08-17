import type { AIProviderCapabilities } from "../contracts";

export interface AIModelRouteRequest {
  readonly task: string;
  readonly requiredCapabilities?: Partial<AIProviderCapabilities>;
  readonly preferredProviderId?: string;
  readonly preferredModel?: string;
  readonly maxCost?: number;
}

export interface AIModelRoute {
  readonly providerId: string;
  readonly model: string;
}
