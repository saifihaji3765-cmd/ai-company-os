import type {
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  UsageRecordId,
  UsageResource,
  UsageUnit,
} from "./usage.entity";

export interface RecordUsageInput {
  readonly organizationId: OrganizationId;
  readonly resource: UsageResource;
  readonly unit: UsageUnit;
  readonly quantity: number;
  readonly occurredAt: ISODateString;
}

export interface UsageRecord {
  readonly id: UsageRecordId;
  readonly organizationId: OrganizationId;
  readonly resource: UsageResource;
  readonly unit: UsageUnit;
  readonly quantity: number;
  readonly occurredAt: ISODateString;
  readonly createdAt: ISODateString;
}

export interface UsageQuery {
  readonly organizationId: OrganizationId;
  readonly resource?: UsageResource;
  readonly unit?: UsageUnit;
  readonly from?: ISODateString;
  readonly to?: ISODateString;
}

export interface UsageAggregate {
  readonly organizationId: OrganizationId;
  readonly resource: UsageResource;
  readonly unit: UsageUnit;
  readonly totalQuantity: number;
  readonly from: ISODateString;
  readonly to: ISODateString;
}

export interface UsageListQuery {
  readonly organizationId: OrganizationId;
  readonly page: number;
  readonly pageSize: number;
  readonly resource?: UsageResource;
  readonly from?: ISODateString;
  readonly to?: ISODateString;
}

export interface UsageListResult {
  readonly items: readonly UsageRecord[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
