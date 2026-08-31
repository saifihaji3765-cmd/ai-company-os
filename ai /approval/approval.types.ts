export type AIApprovalLevel =
  | 0
  | 1
  | 2
  | 3;

export type AIApprovalStatus =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected"
  | "expired";

export interface AIApprovalRequest {
  readonly id: string;
  readonly actionId: string;
  readonly actionDescription: string;
  readonly approvalLevel: AIApprovalLevel;
  readonly status: AIApprovalStatus;
  readonly requestedBy: string;
  readonly requestedAt: string;
  readonly decidedAt?: string;
  readonly decidedBy?: string;
  readonly reason?: string;
}
