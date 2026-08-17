export interface AIProviderCredentials {
  readonly providerId: string;
  readonly apiKey?: string;
  readonly organizationId?: string;
  readonly endpoint?: string;
}

export interface AIProviderCredentialSource {
  readonly type:
    | "environment"
    | "secret-manager"
    | "runtime";
  readonly reference: string;
}
