import type { ISODateString } from "../../core";

import type {
  OrganizationId,
  OrganizationStatus,
} from "./organization.entity";

export interface CreateOrganizationInput {
  readonly name: string;
  readonly slug: string;
}

export interface UpdateOrganizationInput {
  readonly name?: string;
  readonly slug?: string;
}

export interface OrganizationRecord {
  readonly id: OrganizationId;
  readonly name: string;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface OrganizationSummary {
  readonly id: OrganizationId;
  readonly name: string;
  readonly slug: string;
  readonly status: OrganizationStatus;
}

export interface OrganizationQuery {
  readonly id?: OrganizationId;
  readonly slug?: string;
}

export interface OrganizationListQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly status?: OrganizationStatus;
  readonly search?: string;
}

export interface OrganizationListResult {
  readonly items: readonly OrganizationSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
