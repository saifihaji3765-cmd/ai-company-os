import type {
  AIProviderCredentials,
  AIProviderCredentialSource,
} from "./provider-credentials.types";

export interface AICredentialResolver {
  resolve(
    providerId: string,
    source: AIProviderCredentialSource,
  ): Promise<AIProviderCredentials>;
}

export class EnvironmentCredentialResolver
  implements AICredentialResolver
{
  public async resolve(
    providerId: string,
    source: AIProviderCredentialSource,
  ): Promise<AIProviderCredentials> {
    if (source.type !== "environment") {
      throw new Error(
        `Unsupported credential source: ${source.type}`,
      );
    }

    const apiKey = process.env[source.reference];

    if (!apiKey) {
      throw new Error(
        `Credentials not configured for provider: ${providerId}`,
      );
    }

    return {
      providerId,
      apiKey,
    };
  }
}
