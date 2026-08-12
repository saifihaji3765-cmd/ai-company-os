import type {
  Result,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  AuditEntity,
  AuditEventId,
} from "./audit.entity";

import type {
  AuditListQuery,
  AuditQuery,
  CreateAuditEventInput,
} from "./audit.types";

export interface AuditRepository {
  findById(
    auditEventId: AuditEventId,
  ): Promise<Result<AuditEntity | null, Error>>;

  append(
    input: CreateAuditEventInput,
  ): Promise<Result<AuditEntity, Error>>;

  list(
    query: AuditListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly AuditEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  count(
    query: AuditQuery,
  ): Promise<Result<number, Error>>;

  countByOrganization(
    organizationId: OrganizationId,
    query?: AuditQuery,
  ): Promise<Result<number, Error>>;
}
