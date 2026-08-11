import {
  ApplicationError,
  fail,
  ok,
  type Result,
} from "../../core";

import type {
  RoleEntity,
  RoleId,
} from "./role.entity";

import type {
  RoleRepository,
} from "./role.repository";

import type {
  CreateRoleInput,
  RoleListQuery,
  UpdateRoleInput,
} from "./role.types";

export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
  ) {}

  async getById(
    roleId: RoleId,
  ): Promise<Result<RoleEntity, ApplicationError>> {
    const result =
      await this.roleRepository.findById(roleId);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve role.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Role not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async getByKey(
    key: RoleEntity["key"],
  ): Promise<Result<RoleEntity, ApplicationError>> {
    const result =
      await this.roleRepository.findByKey(key);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve role.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Role not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async create(
    input: CreateRoleInput,
  ): Promise<Result<RoleEntity, ApplicationError>> {
    const existingRole =
      await this.roleRepository.findByKey(input.key);

    if (!existingRole.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to verify role uniqueness.",
          statusCode: 503,
          cause: existingRole.error,
        }),
      );
    }

    if (existingRole.value) {
      return fail(
        new ApplicationError({
          code: "CONFLICT",
          message: "A role with this key already exists.",
          statusCode: 409,
        }),
      );
    }

    if (
      input.key === "owner" &&
      input.scope !== "platform"
    ) {
      return fail(
        new ApplicationError({
          code: "VALIDATION_ERROR",
          message:
            "Owner role must use platform scope.",
          statusCode: 400,
        }),
      );
    }

    const result =
      await this.roleRepository.create({
        ...input,
        systemManaged:
          input.key === "owner"
            ? true
            : input.systemManaged,
      });

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to create role.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async update(
    roleId: RoleId,
    input: UpdateRoleInput,
  ): Promise<Result<RoleEntity, ApplicationError>> {
    const existingRole =
      await this.getById(roleId);

    if (!existingRole.ok) {
      return existingRole;
    }

    if (existingRole.value.systemManaged) {
      return fail(
        new ApplicationError({
          code: "AUTHORIZATION_ERROR",
          message:
            "System-managed roles cannot be modified through the standard role service.",
          statusCode: 403,
        }),
      );
    }

    if (
      existingRole.value.key === "owner" &&
      input.scope !== undefined &&
      input.scope !== "platform"
    ) {
      return fail(
        new ApplicationError({
          code: "VALIDATION_ERROR",
          message:
            "Owner role must use platform scope.",
          statusCode: 400,
        }),
      );
    }

    const result =
      await this.roleRepository.update(
        roleId,
        input,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to update role.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: RoleListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly RoleEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.roleRepository.list(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve roles.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async delete(
    roleId: RoleId,
  ): Promise<Result<void, ApplicationError>> {
    const existingRole =
      await this.getById(roleId);

    if (!existingRole.ok) {
      return existingRole;
    }

    if (existingRole.value.systemManaged) {
      return fail(
        new ApplicationError({
          code: "AUTHORIZATION_ERROR",
          message:
            "System-managed roles cannot be deleted.",
          statusCode: 403,
        }),
      );
    }

    const result =
      await this.roleRepository.delete(roleId);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to delete role.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(undefined);
  }
}
