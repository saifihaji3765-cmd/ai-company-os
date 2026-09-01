export type AIEmergencySeverity =
  | "critical"
  | "emergency";

export type AIEmergencyStatus =
  | "detected"
  | "active"
  | "contained"
  | "resolved";

export interface AIEmergencyEvent {
  readonly id: string;
  readonly severity: AIEmergencySeverity;
  readonly status: AIEmergencyStatus;
  readonly source: string;
  readonly reason: string;
  readonly detectedAt: string;
  readonly activatedAt?: string;
  readonly resolvedAt?: string;
}
