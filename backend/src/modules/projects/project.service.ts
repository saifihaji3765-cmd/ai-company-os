import {
  ApplicationError,
  fail,
  ok,
  type OrganizationId,
  type Result,
} from "../../core";

import type {
  WorkspaceId,
} from "../workspaces";

import type {
  ProjectEntity,
  ProjectId,
} from "./project.entity";

import type {
  ProjectRepository,
} from "./project.repository";

import type {
  CreateProjectInput,
  ProjectListQuery,
  UpdateProjectInput,
} from "./project.types";

export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
  ) {}

  async getById(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
    projectId: ProjectId,
  ): Promise<Result<ProjectEntity, ApplicationError>> {
    const result =
      await this.projectRepository.findById(
        organizationId,
        workspaceId,
        projectId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve project.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Project not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async getBySlug(
    organizationId: OrganizationId,
    workspaceId: WorkspaceId,
    slug: string,
  ): Promise<Result<ProjectEntity, ApplicationError>> {
    const normalizedSlug = slug.trim().toLowerCase();

    const result =
      await this.projectRepository.findBySlug(
        organizationId,
        workspaceId,
        normalizedSlug,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve project.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Project not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async create(
    input: CreateProjectInput,
  ): Promise<Result<ProjectEntity, ApplicationError>> {
    const name = input.name.trim();
    const slug = input.slug.trim().toLowerCase();

    const existingProject =
      await this.projectRepository.findBySlug(
        input.organizationId,
        input.workspaceId,
        slug,
      );

    if (!existingProject.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to verify project uniqueness.",
          statusCode: 503,
          cause: existingProject.error,
        }),
      );
    }

    if (existingProject.value) {
      return fail(
        new ApplicationError({
          code: "CONFLICT",
          message:
            "A project with this slug already exists in the workspace.",
          statusCode: 409,
        }),
      );
    }

    const result =
      await this.projectRepository.create({
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
        name,
        slug,
      });

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to create project.",
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
    projectId: ProjectId,
    input: UpdateProjectInput,
  ): Promise<Result<ProjectEntity, ApplicationError>> {
    const existingProject =
      await this.getById(
        organizationId,
        workspaceId,
        projectId,
      );

    if (!existingProject.ok) {
      return existingProject;
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
          message: "Project name cannot be empty.",
          statusCode: 400,
        }),
      );
    }

    if (slug !== undefined) {
      const existingBySlug =
        await this.projectRepository.findBySlug(
          organizationId,
          workspaceId,
          slug,
        );

      if (!existingBySlug.ok) {
        return fail(
          new ApplicationError({
            code: "DEPENDENCY_ERROR",
            message:
              "Unable to verify project slug uniqueness.",
            statusCode: 503,
            cause: existingBySlug.error,
          }),
        );
      }

      if (
        existingBySlug.value &&
        existingBySlug.value.id !== projectId
      ) {
        return fail(
          new ApplicationError({
            code: "CONFLICT",
            message:
              "A project with this slug already exists in the workspace.",
            statusCode: 409,
          }),
        );
      }
    }

    const result =
      await this.projectRepository.update(
        organizationId,
        workspaceId,
        projectId,
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
          message: "Unable to update project.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: ProjectListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly ProjectEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.projectRepository.list(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve projects.",
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
    projectId: ProjectId,
  ): Promise<Result<void, ApplicationError>> {
    const existingProject =
      await this.getById(
        organizationId,
        workspaceId,
        projectId,
      );

    if (!existingProject.ok) {
      return existingProject;
    }

    const result =
      await this.projectRepository.delete(
        organizationId,
        workspaceId,
        projectId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to delete project.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(undefined);
  }
}
