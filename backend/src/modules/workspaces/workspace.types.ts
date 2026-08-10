import type {
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  WorkspaceId,
  WorkspaceStatus,
} from "./workspace.entity";

export interface CreateWorkspaceInput {
  readonly organizationId: OrganizationId;
  readonly name: string;
  readonly slug: string;
}

export interface UpdateWorkspaceInput {
  readonly name?: string;
  readonly slug?: string;
  readonly status?: WorkspaceStatus;
}

export interface WorkspaceRecord {
  readonly id: WorkspaceId;
  readonly organizationId: OrganizationId;
  readonly name: string;
  readonly slug: string;
  readonly status: WorkspaceStatus;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface WorkspaceSummary {
  readonly id: WorkspaceId;
  readonly organizationId: OrganizationId;
  readonly name: string;
  readonly slug: string;
  readonly status: WorkspaceStatus;
}

export interface WorkspaceQuery {
  readonly id?: WorkspaceId;
  readonly organizationId?: OrganizationId;
  readonly slug?: string;
}

export interface WorkspaceListQuery {
  readonly organizationId: OrganizationId;
  readonly page: number;
  readonly pageSize: number;
  readonly status?: WorkspaceStatus;
  readonly search?: string;
}

export interface WorkspaceListResult {
  readonly items: readonly WorkspaceSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
