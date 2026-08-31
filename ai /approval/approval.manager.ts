import type {
  AIApprovalLevel,
  AIApprovalRequest,
  AIApprovalStatus,
} from "./approval.types";

export class AIApprovalManager {
  private readonly requests =
    new Map<string, AIApprovalRequest>();

  public createRequest(input: {
    readonly actionId: string;
    readonly actionDescription: string;
    readonly approvalLevel: AIApprovalLevel;
    readonly requestedBy: string;
  }): AIApprovalRequest {
    const now = new Date().toISOString();

    const status: AIApprovalStatus =
      input.approvalLevel === 0
        ? "not_required"
        : "pending";

    const request: AIApprovalRequest = {
      id: `approval-${Date.now()}`,
      actionId: input.actionId,
      actionDescription: input.actionDescription,
      approvalLevel: input.approvalLevel,
      status,
      requestedBy: input.requestedBy,
      requestedAt: now,
    };

    this.requests.set(request.id, request);

    return request;
  }

  public getRequest(
    id: string,
  ): AIApprovalRequest | undefined {
    return this.requests.get(id);
  }

  public decide(
    id: string,
    approved: boolean,
    decidedBy: string,
    reason?: string,
  ): AIApprovalRequest {
    const request = this.requests.get(id);

    if (!request) {
      throw new Error(`Approval request not found: ${id}`);
    }

    if (request.approvalLevel === 0) {
      throw new Error(
        "Level 0 actions do not require approval.",
      );
    }

    if (request.status !== "pending") {
      throw new Error(
        `Approval request is not pending: ${id}`,
      );
    }

    const updatedRequest: AIApprovalRequest = {
      ...request,
      status: approved ? "approved" : "rejected",
      decidedAt: new Date().toISOString(),
      decidedBy,
      reason,
    };

    this.requests.set(id, updatedRequest);

    return updatedRequest;
  }

  public listPending(): readonly AIApprovalRequest[] {
    return Array.from(this.requests.values()).filter(
      (request) => request.status === "pending",
    );
  }
}
