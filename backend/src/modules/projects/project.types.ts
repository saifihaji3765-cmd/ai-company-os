import type {
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  WorkspaceId,
} from "../workspaces";

import type {
  ProjectId,
  ProjectStatus,
} from "./project.entity";

export interface CreateProjectInput {
  readonly organizationId: OrganizationId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly slug: string;
}

export interface UpdateProjectInput {
  readonly name?: string;
  readonly slug?: string;
  readonly status?: ProjectStatus;
}

export interface ProjectRecord {
  readonly id: ProjectId;
  readonly organizationId: OrganizationId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly slug: string;
  readonly status: ProjectStatus;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface ProjectSummary {
  readonly id: ProjectId;
  readonly organizationId: OrganizationId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly slug: string;
  readonly status: ProjectStatus;
}

export interface ProjectQuery {
  readonly id?: ProjectId;
  readonly organizationId?: OrganizationId;
  readonly workspaceId?: WorkspaceId;
  readonly slug?: string;
}

export interface ProjectListQuery {
  readonly organizationId: OrganizationId;
  readonly workspaceId: WorkspaceId;
  readonly page: number;
  readonly pageSize: number;
  readonly status?: ProjectStatus;
  readonly search?: string;
}

export interface ProjectListResult {
  readonly items: readonly ProjectSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
