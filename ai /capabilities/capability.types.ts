export type AICapabilityStatus =
  | "active"
  | "inactive"
  | "disabled";

export interface AICapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly dependencies: readonly string[];
  readonly permissions: readonly string[];
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly owner: string;
  readonly status: AICapabilityStatus;
}
