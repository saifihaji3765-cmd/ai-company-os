import {
  ApplicationError,
  fail,
  ok,
  type OrganizationId,
  type Result,
} from "../../core";

import type { OrganizationEntity } from "./organization.entity";
import type { OrganizationRepository } from "./organization.repository";
import type {
  CreateOrganizationInput,
  OrganizationListQuery,
  UpdateOrganizationInput,
} from "./organization.types";

export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async getById(
    organizationId: OrganizationId,
  ): Promise<Result<OrganizationEntity, ApplicationError>> {
    const result =
      await this.organizationRepository.findById(
        organizationId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve organization.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Organization not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async getBySlug(
    slug: string,
  ): Promise<Result<OrganizationEntity, ApplicationError>> {
    const normalizedSlug = slug.trim().toLowerCase();

    const result =
      await this.organizationRepository.findBySlug(
        normalizedSlug,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve organization.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Organization not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async create(
    input: CreateOrganizationInput,
  ): Promise<Result<OrganizationEntity, ApplicationError>> {
    const name = input.name.trim();
    const slug = input.slug.trim().toLowerCase();

    const existingOrganization =
      await this.organizationRepository.findBySlug(slug);

    if (!existingOrganization.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to verify organization uniqueness.",
          statusCode: 503,
          cause: existingOrganization.error,
        }),
      );
    }

    if (existingOrganization.value) {
      return fail(
        new ApplicationError({
          code: "CONFLICT",
          message: "An organization with this slug already exists.",
          statusCode: 409,
        }),
      );
    }

    const result =
      await this.organizationRepository.create({
        name,
        slug,
      });

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to create organization.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async update(
    organizationId: OrganizationId,
    input: UpdateOrganizationInput,
  ): Promise<Result<OrganizationEntity, ApplicationError>> {
    const existingOrganization =
      await this.getById(organizationId);

    if (!existingOrganization.ok) {
      return existingOrganization;
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
          message: "Organization name cannot be empty.",
          statusCode: 400,
        }),
      );
    }

    if (slug !== undefined) {
      const existingBySlug =
        await this.organizationRepository.findBySlug(slug);

      if (!existingBySlug.ok) {
        return fail(
          new ApplicationError({
            code: "DEPENDENCY_ERROR",
            message:
              "Unable to verify organization slug uniqueness.",
            statusCode: 503,
            cause: existingBySlug.error,
          }),
        );
      }

      if (
        existingBySlug.value &&
        existingBySlug.value.id !== organizationId
      ) {
        return fail(
          new ApplicationError({
            code: "CONFLICT",
            message:
              "An organization with this slug already exists.",
            statusCode: 409,
          }),
        );
      }
    }

    const result =
      await this.organizationRepository.update(
        organizationId,
        {
          ...(name !== undefined ? { name } : {}),
          ...(slug !== undefined ? { slug } : {}),
        },
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to update organization.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: OrganizationListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly OrganizationEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.organizationRepository.list(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve organizations.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async delete(
    organizationId: OrganizationId,
  ): Promise<Result<void, ApplicationError>> {
    const existingOrganization =
      await this.getById(organizationId);

    if (!existingOrganization.ok) {
      return existingOrganization;
    }

    const result =
      await this.organizationRepository.delete(
        organizationId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to delete organization.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(undefined);
  }
}
