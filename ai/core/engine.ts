import type { AIRequest } from "./request";
import type { AIResponse } from "./response";

export interface AIEngine {
  execute<T = unknown>(
    request: AIRequest,
  ): Promise<AIResponse<T>>;
}
