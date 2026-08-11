import type {
  Result,
} from "../../core";

import type {
  PermissionEntity,
  PermissionId,
  PermissionAction,
  PermissionResource,
  PermissionScope,
} from "./permission.entity";

import type {
  CreatePermissionInput,
  PermissionListQuery,
  UpdatePermissionInput,
} from "./permission.types";

export interface PermissionRepository {
  findById(
    permissionId: PermissionId,
  ): Promise<Result<PermissionEntity | null, Error>>;

  findByKey(
    resource: PermissionResource,
    action: PermissionAction,
    scope: PermissionScope,
  ): Promise<Result<PermissionEntity | null, Error>>;

  list(
    query: PermissionListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly PermissionEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  create(
    input: CreatePermissionInput,
  ): Promise<Result<PermissionEntity, Error>>;

  update(
    permissionId: PermissionId,
    input: UpdatePermissionInput,
  ): Promise<Result<PermissionEntity, Error>>;

  delete(
    permissionId: PermissionId,
  ): Promise<Result<void, Error>>;
}
