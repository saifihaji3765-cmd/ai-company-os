import type {
  AIRecoveryRequest,
  AIRecoveryStatus,
  AIRecoveryStrategy,
} from "./recovery.types";

export interface AIRecoveryCoordinator {
  createRequest(input: {
    readonly executionId: string;
    readonly strategy: AIRecoveryStrategy;
    readonly reason: string;
  }): Promise<AIRecoveryRequest>;

  updateStatus(
    id: string,
    status: AIRecoveryStatus,
  ): Promise<AIRecoveryRequest>;

  get(
    id: string,
  ): Promise<AIRecoveryRequest | undefined>;

  listByExecution(
    executionId: string,
  ): Promise<readonly AIRecoveryRequest[]>;
}

export class BasicRecoveryCoordinator
  implements AIRecoveryCoordinator
{
  private readonly requests =
    new Map<string, AIRecoveryRequest>();

  public async createRequest(input: {
    readonly executionId: string;
    readonly strategy: AIRecoveryStrategy;
    readonly reason: string;
  }): Promise<AIRecoveryRequest> {
    const previousAttempts = Array.from(
      this.requests.values(),
    ).filter(
      (request) =>
        request.executionId === input.executionId,
    ).length;

    const request: AIRecoveryRequest = {
      id: `recovery-${Date.now()}`,
      executionId: input.executionId,
      strategy: input.strategy,
      status: "pending",
      reason: input.reason,
      attempt: previousAttempts + 1,
      createdAt: new Date().toISOString(),
    };

    this.requests.set(request.id, request);

    return request;
  }

  public async updateStatus(
    id: string,
    status: AIRecoveryStatus,
  ): Promise<AIRecoveryRequest> {
    const request = this.requests.get(id);

    if (!request) {
      throw new Error(`Recovery request not found: ${id}`);
    }

    const terminalStatuses: AIRecoveryStatus[] = [
      "recovered",
      "failed",
      "escalated",
    ];

    const updated: AIRecoveryRequest = {
      ...request,
      status,
      completedAt: terminalStatuses.includes(status)
        ? new Date().toISOString()
        : request.completedAt,
    };

    this.requests.set(id, updated);

    return updated;
  }

  public async get(
    id: string,
  ): Promise<AIRecoveryRequest | undefined> {
    return this.requests.get(id);
  }

  public async listByExecution(
    executionId: string,
  ): Promise<readonly AIRecoveryRequest[]> {
    return Array.from(
      this.requests.values(),
    ).filter(
      (request) =>
        request.executionId === executionId,
    );
  }
}
