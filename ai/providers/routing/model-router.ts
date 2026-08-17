import type { AIProviderRegistry } from "../registry";
import type { AIModelRoute, AIModelRouteRequest } from "./model-routing.types";
import type { AIRoutingPolicy } from "./routing-policy";

export class AIModelRouter {
  public constructor(
    private readonly registry: AIProviderRegistry,
    private readonly policy: AIRoutingPolicy,
  ) {}

  public route(
    request: AIModelRouteRequest,
  ): AIModelRoute | undefined {
    const route = this.policy.selectRoute(request);

    if (!route) {
      return undefined;
    }

    const provider = this.registry.get(route.providerId);

    if (!provider || !provider.enabled) {
      return undefined;
    }

    return route;
  }
}
