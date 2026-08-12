import type {
  ISODateString,
} from "../../core";

import type {
  HealthCheckResult,
  HealthEntityProps,
  HealthStatus,
} from "./health.entity";

export interface HealthCheck {
  readonly name: string;

  check(): Promise<HealthCheckResult>;
}

export interface HealthSnapshot
  extends HealthEntityProps {}

export interface HealthResponse {
  readonly status: HealthStatus;
  readonly version: string;
  readonly uptimeSeconds: number;
  readonly checkedAt: ISODateString;
  readonly checks: readonly HealthCheckResult[];
}

export interface HealthCheckSummary {
  readonly total: number;
  readonly up: number;
  readonly degraded: number;
  readonly down: number;
}
