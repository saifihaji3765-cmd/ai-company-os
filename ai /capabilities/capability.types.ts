export type AICapabilityStatus =
  | "active"
  | "inactive"
  | "disabled";

export type AICapabilityRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AICapabilityPermission {
  readonly action: string;
  readonly resource: string;
  readonly requiresApproval?: boolean;
}

export interface AICapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  /**
   * Kept as string for backward compatibility
   * with the existing capability registry.
   */
  readonly version: string;

  readonly dependencies: readonly string[];
  readonly permissions: readonly string[];
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly owner: string;
  readonly status: AICapabilityStatus;

  /**
   * Enterprise governance fields.
   */
  readonly risk?: AICapabilityRisk;

  readonly permissionContracts?: readonly AICapabilityPermission[];

  readonly requiresApproval?: boolean;

  readonly maxExecutionTimeMs?: number;

  readonly tags?: readonly string[];

  readonly createdAt?: string;
  readonly updatedAt?: string;
}
