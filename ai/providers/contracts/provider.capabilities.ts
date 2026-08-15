export interface AIProviderCapabilities {
  readonly textGeneration: boolean;
  readonly vision: boolean;
  readonly audioInput: boolean;
  readonly audioOutput: boolean;
  readonly imageGeneration: boolean;
  readonly embeddings: boolean;
  readonly toolCalling: boolean;
  readonly structuredOutput: boolean;
  readonly streaming: boolean;
}
