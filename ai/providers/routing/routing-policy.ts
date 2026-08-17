import type { AIModelRouteRequest } from "./model-routing.types";

export interface AIRoutingPolicy {
  selectRoute(
    request: AIModelRouteRequest,
  ): {
    readonly providerId: string;
    readonly model: string;
  } | undefined;
}
