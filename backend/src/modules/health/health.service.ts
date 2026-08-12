import {
  ApplicationError,
  fail,
  ok,
  type Result,
} from "../../core";

import {
  HealthEntity,
  type HealthStatus,
} from "./health.entity";

import type {
  HealthRepository,
} from "./health.repository";

export class HealthService {
  constructor(
    private readonly healthRepository: HealthRepository,
  ) {}

  async check(): Promise<
    Result<HealthEntity, ApplicationError>
  > {
    const [
      versionResult,
      uptimeResult,
      checksResult,
    ] = await Promise.all([
      this.healthRepository.getVersion(),
      this.healthRepository.getUptimeSeconds(),
      this.healthRepository.runChecks(),
    ]);

    if (!versionResult.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to determine application version.",
          statusCode: 503,
          cause: versionResult.error,
        }),
      );
    }

    if (!uptimeResult.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to determine application uptime.",
          statusCode: 503,
          cause: uptimeResult.error,
        }),
      );
    }

    if (!checksResult.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to execute health checks.",
          statusCode: 503,
          cause: checksResult.error,
        }),
      );
    }

    const checks = checksResult.value;

    const hasDownCheck = checks.some(
      (check) => check.status === "down",
    );

    const hasDegradedCheck = checks.some(
      (check) => check.status === "degraded",
    );

    const status: HealthStatus =
      hasDownCheck
        ? "unhealthy"
        : hasDegradedCheck
          ? "degraded"
          : "healthy";

    const health = HealthEntity.create({
      status,
      version: versionResult.value,
      uptimeSeconds: uptimeResult.value,
      checkedAt: new Date().toISOString(),
      checks,
    });

    return ok(health);
  }
}
