import type {
  Result,
} from "../../core";

import type {
  OrganizationEntity,
  OrganizationId,
} from "./organization.entity";

import type {
  CreateOrganizationInput,
  OrganizationListQuery,
  UpdateOrganizationInput,
} from "./organization.types";

export interface OrganizationRepository {
  findById(
    organizationId: OrganizationId,
  ): Promise<
    Result<OrganizationEntity | null, Error>
  >;

  findBySlug(
    slug: string,
  ): Promise<
    Result<OrganizationEntity | null, Error>
  >;

  list(
    query: OrganizationListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly OrganizationEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  create(
    input: CreateOrganizationInput,
  ): Promise<
    Result<OrganizationEntity, Error>
  >;

  update(
    organizationId: OrganizationId,
    input: UpdateOrganizationInput,
  ): Promise<
    Result<OrganizationEntity, Error>
  >;

  delete(
    organizationId: OrganizationId,
  ): Promise<Result<void, Error>>;
}
