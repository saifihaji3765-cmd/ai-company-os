export interface AIProviderResponse {
  readonly providerId: string;
  readonly model: string;
  readonly output: string;
  readonly usage?: AIProviderUsage;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface AIProviderUsage {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly totalTokens?: number;
}
