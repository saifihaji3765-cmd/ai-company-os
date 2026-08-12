import type {
  ISODateString,
} from "../../core";

export type HealthStatus =
  | "healthy"
  | "degraded"
  | "unhealthy";

export type HealthCheckStatus =
  | "up"
  | "down"
  | "degraded";

export interface HealthCheckResult {
  readonly name: string;
  readonly status: HealthCheckStatus;
  readonly latencyMs: number;
  readonly message?: string;
}

export interface HealthEntityProps {
  readonly status: HealthStatus;
  readonly version: string;
  readonly uptimeSeconds: number;
  readonly checkedAt: ISODateString;
  readonly checks: readonly HealthCheckResult[];
}

export class HealthEntity {
  private readonly props: HealthEntityProps;

  private constructor(
    props: HealthEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
      checks: Object.freeze(
        props.checks.map((check) =>
          Object.freeze({
            ...check,
          }),
        ),
      ),
    });
  }

  static create(
    props: HealthEntityProps,
  ): HealthEntity {
    HealthEntity.validate(props);

    return new HealthEntity(props);
  }

  get status(): HealthStatus {
    return this.props.status;
  }

  get version(): string {
    return this.props.version;
  }

  get uptimeSeconds(): number {
    return this.props.uptimeSeconds;
  }

  get checkedAt(): ISODateString {
    return this.props.checkedAt;
  }

  get checks(): readonly HealthCheckResult[] {
    return this.props.checks;
  }

  get isHealthy(): boolean {
    return this.props.status === "healthy";
  }

  toObject(): HealthEntityProps {
    return {
      ...this.props,
      checks: this.props.checks.map(
        (check) => ({
          ...check,
        }),
      ),
    };
  }

  private static validate(
    props: HealthEntityProps,
  ): void {
    if (!props.version.trim()) {
      throw new Error(
        "Health version is required.",
      );
    }

    if (
      !Number.isFinite(
        props.uptimeSeconds,
      ) ||
      props.uptimeSeconds < 0
    ) {
      throw new Error(
        "Uptime must be a non-negative number.",
      );
    }

    if (
      ![
        "healthy",
        "degraded",
        "unhealthy",
      ].includes(props.status)
    ) {
      throw new Error(
        "Invalid health status.",
      );
    }

    for (const check of props.checks) {
      if (!check.name.trim()) {
        throw new Error(
          "Health check name is required.",
        );
      }

      if (
        ![
          "up",
          "down",
          "degraded",
        ].includes(check.status)
      ) {
        throw new Error(
          "Invalid health check status.",
        );
      }

      if (
        !Number.isFinite(
          check.latencyMs,
        ) ||
        check.latencyMs < 0
      ) {
        throw new Error(
          "Health check latency must be non-negative.",
        );
      }
    }
  }
}
