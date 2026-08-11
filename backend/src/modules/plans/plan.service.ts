import {
  ApplicationError,
  fail,
  ok,
  type Result,
} from "../../core";

import type {
  PlanEntity,
  PlanId,
} from "./plan.entity";

import type {
  PlanRepository,
} from "./plan.repository";

import type {
  CreatePlanInput,
  PlanListQuery,
  UpdatePlanInput,
} from "./plan.types";

export class PlanService {
  constructor(
    private readonly planRepository: PlanRepository,
  ) {}

  async getById(
    planId: PlanId,
  ): Promise<Result<PlanEntity, ApplicationError>> {
    const result =
      await this.planRepository.findById(planId);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve plan.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Plan not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async getByKey(
    key: PlanEntity["key"],
  ): Promise<Result<PlanEntity, ApplicationError>> {
    const result =
      await this.planRepository.findByKey(key);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve plan.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Plan not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async create(
    input: CreatePlanInput,
  ): Promise<Result<PlanEntity, ApplicationError>> {
    const existingPlan =
      await this.planRepository.findByKey(input.key);

    if (!existingPlan.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to verify plan uniqueness.",
          statusCode: 503,
          cause: existingPlan.error,
        }),
      );
    }

    if (existingPlan.value) {
      return fail(
        new ApplicationError({
          code: "CONFLICT",
          message: "A plan with this key already exists.",
          statusCode: 409,
        }),
      );
    }

    const result =
      await this.planRepository.create(input);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to create plan.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async update(
    planId: PlanId,
    input: UpdatePlanInput,
  ): Promise<Result<PlanEntity, ApplicationError>> {
    const existingPlan =
      await this.getById(planId);

    if (!existingPlan.ok) {
      return existingPlan;
    }

    if (existingPlan.value.systemManaged) {
      return fail(
        new ApplicationError({
          code: "AUTHORIZATION_ERROR",
          message:
            "System-managed plans cannot be modified through the standard plan service.",
          statusCode: 403,
        }),
      );
    }

    const result =
      await this.planRepository.update(
        planId,
        input,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to update plan.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: PlanListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly PlanEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.planRepository.list(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve plans.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async delete(
    planId: PlanId,
  ): Promise<Result<void, ApplicationError>> {
    const existingPlan =
      await this.getById(planId);

    if (!existingPlan.ok) {
      return existingPlan;
    }

    if (existingPlan.value.systemManaged) {
      return fail(
        new ApplicationError({
          code: "AUTHORIZATION_ERROR",
          message:
            "System-managed plans cannot be deleted.",
          statusCode: 403,
        }),
      );
    }

    const result =
      await this.planRepository.delete(planId);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to delete plan.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(undefined);
  }
}
