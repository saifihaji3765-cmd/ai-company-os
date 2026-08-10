import type {
  OrganizationId,
  Result,
  WorkspaceId,
} from "../../core";

import type {
  ProjectEntity,
  ProjectId,
} from "./project.entity";

import type {
  CreateProjectInput,
  ProjectListQuery,
  UpdateProjectInput,
} from "./project.types";

export interface ProjectRepository {
  findById(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
    projectId: ProjectId,
  ): Promise<Result<ProjectEntity | null, Error>>;

  findBySlug(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
    slug: string,
  ): Promise<Result<ProjectEntity | null, Error>>;

  list(
    query: ProjectListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly ProjectEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  create(
    input: CreateProjectInput,
  ): Promise<Result<ProjectEntity, Error>>;

  update(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
    projectId: ProjectId,
    input: UpdateProjectInput,
  ): Promise<Result<ProjectEntity, Error>>;

  delete(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
    projectId: ProjectId,
  ): Promise<Result<void, Error>>;
}
