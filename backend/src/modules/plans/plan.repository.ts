import type {
  Result,
} from "../../core";

import type {
  PlanEntity,
  PlanId,
} from "./plan.entity";

import type {
  CreatePlanInput,
  PlanListQuery,
  UpdatePlanInput,
} from "./plan.types";

export interface PlanRepository {
  findById(
    planId: PlanId,
  ): Promise<Result<PlanEntity | null, Error>>;

  findByKey(
    key: PlanEntity["key"],
  ): Promise<Result<PlanEntity | null, Error>>;

  list(
    query: PlanListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly PlanEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  create(
    input: CreatePlanInput,
  ): Promise<Result<PlanEntity, Error>>;

  update(
    planId: PlanId,
    input: UpdatePlanInput,
  ): Promise<Result<PlanEntity, Error>>;

  delete(
    planId: PlanId,
  ): Promise<Result<void, Error>>;
}
