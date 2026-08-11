import type {
  Result,
} from "../../core";

import type {
  RoleEntity,
  RoleId,
} from "./role.entity";

import type {
  CreateRoleInput,
  RoleListQuery,
  UpdateRoleInput,
} from "./role.types";

export interface RoleRepository {
  findById(
    roleId: RoleId,
  ): Promise<Result<RoleEntity | null, Error>>;

  findByKey(
    key: RoleEntity["key"],
  ): Promise<Result<RoleEntity | null, Error>>;

  list(
    query: RoleListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly RoleEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  create(
    input: CreateRoleInput,
  ): Promise<Result<RoleEntity, Error>>;

  update(
    roleId: RoleId,
    input: UpdateRoleInput,
  ): Promise<Result<RoleEntity, Error>>;

  delete(
    roleId: RoleId,
  ): Promise<Result<void, Error>>;
}
