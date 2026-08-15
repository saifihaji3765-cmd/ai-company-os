import type {
  AIProvider,
  AIProviderCapabilities,
} from "../contracts";

export interface RegisteredAIProvider {
  readonly provider: AIProvider;
  readonly capabilities: AIProviderCapabilities;
  readonly enabled: boolean;
}
