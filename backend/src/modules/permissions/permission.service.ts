import {
  ApplicationError,
  fail,
  ok,
  type Result,
} from "../../core";

import type {
  PermissionEntity,
  PermissionId,
} from "./permission.entity";

import type {
  PermissionRepository,
} from "./permission.repository";

import type {
  CreatePermissionInput,
  PermissionListQuery,
  UpdatePermissionInput,
} from "./permission.types";

export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async getById(
    permissionId: PermissionId,
  ): Promise<Result<PermissionEntity, ApplicationError>> {
    const result =
      await this.permissionRepository.findById(
        permissionId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve permission.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Permission not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async getByKey(
    resource: PermissionEntity["resource"],
    action: PermissionEntity["action"],
    scope: PermissionEntity["scope"],
  ): Promise<Result<PermissionEntity, ApplicationError>> {
    const result =
      await this.permissionRepository.findByKey(
        resource,
        action,
        scope,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve permission.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Permission not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async create(
    input: CreatePermissionInput,
  ): Promise<Result<PermissionEntity, ApplicationError>> {
    if (
      input.resource === "system" &&
      input.scope !== "platform"
    ) {
      return fail(
        new ApplicationError({
          code: "VALIDATION_ERROR",
          message:
            "System permissions must use platform scope.",
          statusCode: 400,
        }),
      );
    }

    const existingPermission =
      await this.permissionRepository.findByKey(
        input.resource,
        input.action,
        input.scope,
      );

    if (!existingPermission.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to verify permission uniqueness.",
          statusCode: 503,
          cause: existingPermission.error,
        }),
      );
    }

    if (existingPermission.value) {
      return fail(
        new ApplicationError({
          code: "CONFLICT",
          message:
            "A permission with this resource, action, and scope already exists.",
          statusCode: 409,
        }),
      );
    }

    const result =
      await this.permissionRepository.create({
        ...input,
        systemManaged:
          input.resource === "system"
            ? true
            : input.systemManaged,
      });

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to create permission.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async update(
    permissionId: PermissionId,
    input: UpdatePermissionInput,
  ): Promise<Result<PermissionEntity, ApplicationError>> {
    const existingPermission =
      await this.getById(permissionId);

    if (!existingPermission.ok) {
      return existingPermission;
    }

    if (existingPermission.value.systemManaged) {
      return fail(
        new ApplicationError({
          code: "AUTHORIZATION_ERROR",
          message:
            "System-managed permissions cannot be modified through the standard permission service.",
          statusCode: 403,
        }),
      );
    }

    const result =
      await this.permissionRepository.update(
        permissionId,
        input,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to update permission.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: PermissionListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly PermissionEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.permissionRepository.list(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve permissions.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async delete(
    permissionId: PermissionId,
  ): Promise<Result<void, ApplicationError>> {
    const existingPermission =
      await this.getById(permissionId);

    if (!existingPermission.ok) {
      return existingPermission;
    }

    if (existingPermission.value.systemManaged) {
      return fail(
        new ApplicationError({
          code: "AUTHORIZATION_ERROR",
          message:
            "System-managed permissions cannot be deleted.",
          statusCode: 403,
        }),
      );
    }

    const result =
      await this.permissionRepository.delete(
        permissionId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to delete permission.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(undefined);
  }
}
