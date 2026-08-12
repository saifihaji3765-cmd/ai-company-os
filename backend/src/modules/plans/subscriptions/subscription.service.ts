import {
  ApplicationError,
  fail,
  ok,
  type Result,
} from "../../core";

import type { OrganizationId } from "../organizations";
import type { PlanId } from "../plans";

import type {
  SubscriptionEntity,
  SubscriptionId,
} from "./subscription.entity";

import type {
  SubscriptionRepository,
} from "./subscription.repository";

import type {
  CreateSubscriptionInput,
  SubscriptionListQuery,
  UpdateSubscriptionInput,
} from "./subscription.types";

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async getById(
    organizationId: OrganizationId,
    subscriptionId: SubscriptionId,
  ): Promise<Result<SubscriptionEntity, ApplicationError>> {
    const result =
      await this.subscriptionRepository.findById(
        organizationId,
        subscriptionId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve subscription.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Subscription not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async getActiveByOrganization(
    organizationId: OrganizationId,
  ): Promise<Result<SubscriptionEntity, ApplicationError>> {
    const result =
      await this.subscriptionRepository.findActiveByOrganization(
        organizationId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to retrieve active subscription.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message:
            "No active subscription found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async create(
    input: CreateSubscriptionInput,
  ): Promise<Result<SubscriptionEntity, ApplicationError>> {
    const existing =
      await this.subscriptionRepository.findActiveByOrganization(
        input.organizationId,
      );

    if (!existing.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to verify existing subscription.",
          statusCode: 503,
          cause: existing.error,
        }),
      );
    }

    if (existing.value) {
      return fail(
        new ApplicationError({
          code: "CONFLICT",
          message:
            "Organization already has an active subscription.",
          statusCode: 409,
        }),
      );
    }

    const result =
      await this.subscriptionRepository.create(
        input,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to create subscription.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async update(
    organizationId: OrganizationId,
    subscriptionId: SubscriptionId,
    input: UpdateSubscriptionInput,
  ): Promise<Result<SubscriptionEntity, ApplicationError>> {
    const existing =
      await this.getById(
        organizationId,
        subscriptionId,
      );

    if (!existing.ok) {
      return existing;
    }

    const result =
      await this.subscriptionRepository.update(
        organizationId,
        subscriptionId,
        input,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to update subscription.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: SubscriptionListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly SubscriptionEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.subscriptionRepository.list(
        query,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to retrieve subscriptions.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async delete(
    organizationId: OrganizationId,
    subscriptionId: SubscriptionId,
  ): Promise<Result<void, ApplicationError>> {
    const existing =
      await this.getById(
        organizationId,
        subscriptionId,
      );

    if (!existing.ok) {
      return existing;
    }

    const result =
      await this.subscriptionRepository.delete(
        organizationId,
        subscriptionId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to delete subscription.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(undefined);
  }
}
