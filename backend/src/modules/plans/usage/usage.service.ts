import {
  ApplicationError,
  fail,
  ok,
  type Result,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  UsageEntity,
  UsageRecordId,
} from "./usage.entity";

import type {
  UsageRepository,
} from "./usage.repository";

import type {
  RecordUsageInput,
  UsageAggregate,
  UsageListQuery,
} from "./usage.types";

export class UsageService {
  constructor(
    private readonly usageRepository: UsageRepository,
  ) {}

  async getById(
    organizationId: OrganizationId,
    usageRecordId: UsageRecordId,
  ): Promise<Result<UsageEntity, ApplicationError>> {
    const result =
      await this.usageRepository.findById(
        organizationId,
        usageRecordId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve usage record.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Usage record not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async record(
    input: RecordUsageInput,
  ): Promise<Result<UsageEntity, ApplicationError>> {
    if (input.quantity <= 0) {
      return fail(
        new ApplicationError({
          code: "VALIDATION_ERROR",
          message:
            "Usage quantity must be greater than zero.",
          statusCode: 400,
        }),
      );
    }

    const result =
      await this.usageRepository.record(input);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to record usage.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: UsageListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly UsageEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.usageRepository.list(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve usage.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async aggregate(
    query: Parameters<
      UsageRepository["aggregate"]
    >[0],
  ): Promise<
    Result<UsageAggregate | null, ApplicationError>
  > {
    const result =
      await this.usageRepository.aggregate(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to aggregate usage.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }
}
