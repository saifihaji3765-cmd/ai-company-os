import type {
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  PlanId,
} from "../plans";

import type {
  SubscriptionId,
  SubscriptionStatus,
} from "./subscription.entity";

export interface CreateSubscriptionInput {
  readonly organizationId: OrganizationId;
  readonly planId: PlanId;
  readonly startsAt: ISODateString;
  readonly endsAt: ISODateString | null;
}

export interface UpdateSubscriptionInput {
  readonly status?: SubscriptionStatus;
  readonly endsAt?: ISODateString | null;
}

export interface SubscriptionRecord {
  readonly id: SubscriptionId;
  readonly organizationId: OrganizationId;
  readonly planId: PlanId;
  readonly status: SubscriptionStatus;
  readonly startsAt: ISODateString;
  readonly endsAt: ISODateString | null;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface SubscriptionSummary {
  readonly id: SubscriptionId;
  readonly organizationId: OrganizationId;
  readonly planId: PlanId;
  readonly status: SubscriptionStatus;
  readonly startsAt: ISODateString;
  readonly endsAt: ISODateString | null;
}

export interface SubscriptionQuery {
  readonly id?: SubscriptionId;
  readonly organizationId?: OrganizationId;
  readonly planId?: PlanId;
  readonly status?: SubscriptionStatus;
}

export interface SubscriptionListQuery {
  readonly organizationId: OrganizationId;
  readonly page: number;
  readonly pageSize: number;
  readonly status?: SubscriptionStatus;
  readonly planId?: PlanId;
}

export interface SubscriptionListResult {
  readonly items: readonly SubscriptionSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
