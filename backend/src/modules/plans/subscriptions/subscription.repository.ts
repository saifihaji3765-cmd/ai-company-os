import type {
  Result,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  PlanId,
} from "../plans";

import type {
  SubscriptionEntity,
  SubscriptionId,
} from "./subscription.entity";

import type {
  CreateSubscriptionInput,
  SubscriptionListQuery,
  UpdateSubscriptionInput,
} from "./subscription.types";

export interface SubscriptionRepository {
  findById(
    organizationId: OrganizationId,
    subscriptionId: SubscriptionId,
  ): Promise<
    Result<SubscriptionEntity | null, Error>
  >;

  findActiveByOrganization(
    organizationId: OrganizationId,
  ): Promise<
    Result<SubscriptionEntity | null, Error>
  >;

  findByPlan(
    organizationId: OrganizationId,
    planId: PlanId,
  ): Promise<
    Result<SubscriptionEntity | null, Error>
  >;

  list(
    query: SubscriptionListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly SubscriptionEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  create(
    input: CreateSubscriptionInput,
  ): Promise<Result<SubscriptionEntity, Error>>;

  update(
    organizationId: OrganizationId,
    subscriptionId: SubscriptionId,
    input: UpdateSubscriptionInput,
  ): Promise<Result<SubscriptionEntity, Error>>;

  delete(
    organizationId: OrganizationId,
    subscriptionId: SubscriptionId,
  ): Promise<Result<void, Error>>;
}
