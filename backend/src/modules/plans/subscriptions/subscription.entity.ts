import type {
  Brand,
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  PlanId,
} from "../plans";

export type SubscriptionId = Brand<
  string,
  "SubscriptionId"
>;

export type SubscriptionStatus =
  | "active"
  | "paused"
  | "expired"
  | "cancelled";

export interface SubscriptionEntityProps {
  readonly id: SubscriptionId;
  readonly organizationId: OrganizationId;
  readonly planId: PlanId;
  readonly status: SubscriptionStatus;
  readonly startsAt: ISODateString;
  readonly endsAt: ISODateString | null;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export class SubscriptionEntity {
  private readonly props: SubscriptionEntityProps;

  private constructor(
    props: SubscriptionEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
    });
  }

  static create(
    props: SubscriptionEntityProps,
  ): SubscriptionEntity {
    SubscriptionEntity.validate(props);

    return new SubscriptionEntity(props);
  }

  get id(): SubscriptionId {
    return this.props.id;
  }

  get organizationId(): OrganizationId {
    return this.props.organizationId;
  }

  get planId(): PlanId {
    return this.props.planId;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }

  get startsAt(): ISODateString {
    return this.props.startsAt;
  }

  get endsAt(): ISODateString | null {
    return this.props.endsAt;
  }

  get createdAt(): ISODateString {
    return this.props.createdAt;
  }

  get updatedAt(): ISODateString {
    return this.props.updatedAt;
  }

  get isActive(): boolean {
    return this.props.status === "active";
  }

  get isExpired(): boolean {
    return this.props.status === "expired";
  }

  get isCancelled(): boolean {
    return this.props.status === "cancelled";
  }

  toObject(): SubscriptionEntityProps {
    return {
      ...this.props,
    };
  }

  private static validate(
    props: SubscriptionEntityProps,
  ): void {
    if (!props.id) {
      throw new Error(
        "Subscription ID is required.",
      );
    }

    if (!props.organizationId) {
      throw new Error(
        "Subscription organization ID is required.",
      );
    }

    if (!props.planId) {
      throw new Error(
        "Subscription plan ID is required.",
      );
    }

    if (
      ![
        "active",
        "paused",
        "expired",
        "cancelled",
      ].includes(props.status)
    ) {
      throw new Error(
        "Invalid subscription status.",
      );
    }

    if (
      props.endsAt !== null &&
      props.endsAt < props.startsAt
    ) {
      throw new Error(
        "Subscription end date cannot precede its start date.",
      );
    }
  }
}
