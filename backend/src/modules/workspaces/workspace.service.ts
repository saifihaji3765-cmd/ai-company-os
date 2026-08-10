import {
  ApplicationError,
  fail,
  ok,
  type OrganizationId,
  type Result,
} from "../../core";

import type {
  WorkspaceEntity,
  WorkspaceId,
} from "./workspace.entity";

import type {
  WorkspaceRepository,
} from "./workspace.repository";

import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceListQuery,
} from "./workspace.types";

export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async getById(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
  ): Promise<Result<WorkspaceEntity, ApplicationError>> {
    const result =
      await this.workspaceRepository.findById(
        organizationId,
        workspaceId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve workspace.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Workspace not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async getBySlug(
    organizationId: OrganizationId,
    slug: string,
  ): Promise<Result<WorkspaceEntity, ApplicationError>> {
    const normalizedSlug = slug.trim().toLowerCase();

    const result =
      await this.workspaceRepository.findBySlug(
        organizationId,
        normalizedSlug,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve workspace.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Workspace not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async create(
    input: CreateWorkspaceInput,
  ): Promise<Result<WorkspaceEntity, ApplicationError>> {
    const name = input.name.trim();
    const slug = input.slug.trim().toLowerCase();

    const existingWorkspace =
      await this.workspaceRepository.findBySlug(
        input.organizationId,
        slug,
      );

    if (!existingWorkspace.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to verify workspace uniqueness.",
          statusCode: 503,
          cause: existingWorkspace.error,
        }),
      );
    }

    if (existingWorkspace.value) {
      return fail(
        new ApplicationError({
          code: "CONFLICT",
          message:
            "A workspace with this slug already exists in the organization.",
          statusCode: 409,
        }),
      );
    }

    const result =
      await this.workspaceRepository.create({
        organizationId: input.organizationId,
        name,
        slug,
      });

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to create workspace.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async update(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
    input: UpdateWorkspaceInput,
  ): Promise<Result<WorkspaceEntity, ApplicationError>> {
    const existingWorkspace =
      await this.getById(
        organizationId,
        workspaceId,
      );

    if (!existingWorkspace.ok) {
      return existingWorkspace;
    }

    const name =
      input.name !== undefined
        ? input.name.trim()
        : undefined;

    const slug =
      input.slug !== undefined
        ? input.slug.trim().toLowerCase()
        : undefined;

    if (name !== undefined && name.length === 0) {
      return fail(
        new ApplicationError({
          code: "VALIDATION_ERROR",
          message: "Workspace name cannot be empty.",
          statusCode: 400,
        }),
      );
    }

    if (slug !== undefined) {
      const existingBySlug =
        await this.workspaceRepository.findBySlug(
          organizationId,
          slug,
        );

      if (!existingBySlug.ok) {
        return fail(
          new ApplicationError({
            code: "DEPENDENCY_ERROR",
            message:
              "Unable to verify workspace slug uniqueness.",
            statusCode: 503,
            cause: existingBySlug.error,
          }),
        );
      }

      if (
        existingBySlug.value &&
        existingBySlug.value.id !== workspaceId
      ) {
        return fail(
          new ApplicationError({
            code: "CONFLICT",
            message:
              "A workspace with this slug already exists in the organization.",
            statusCode: 409,
          }),
        );
      }
    }

    const result =
      await this.workspaceRepository.update(
        organizationId,
        workspaceId,
        {
          ...(name !== undefined ? { name } : {}),
          ...(slug !== undefined ? { slug } : {}),
          ...(input.status !== undefined
            ? { status: input.status }
            : {}),
        },
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to update workspace.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: WorkspaceListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly WorkspaceEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.workspaceRepository.list(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve workspaces.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async delete(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
  ): Promise<Result<void, ApplicationError>> {
    const existingWorkspace =
      await this.getById(
        organizationId,
        workspaceId,
      );

    if (!existingWorkspace.ok) {
      return existingWorkspace;
    }

    const result =
      await this.workspaceRepository.delete(
        organizationId,
        workspaceId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to delete workspace.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(undefined);
  }
}
