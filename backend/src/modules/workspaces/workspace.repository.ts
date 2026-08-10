import type { Result } from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  WorkspaceEntity,
  WorkspaceId,
} from "./workspace.entity";

import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceListQuery,
} from "./workspace.types";

export interface WorkspaceRepository {
  findById(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
  ): Promise<Result<WorkspaceEntity | null, Error>>;

  findBySlug(
    organizationId: OrganizationId,
    slug: string,
  ): Promise<Result<WorkspaceEntity | null, Error>>;

  list(
    query: WorkspaceListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly WorkspaceEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  create(
    input: CreateWorkspaceInput,
  ): Promise<Result<WorkspaceEntity, Error>>;

  update(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
    input: UpdateWorkspaceInput,
  ): Promise<Result<WorkspaceEntity, Error>>;

  delete(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
  ): Promise<Result<void, Error>>;
}
