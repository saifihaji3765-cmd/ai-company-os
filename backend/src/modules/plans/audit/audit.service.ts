import {
  ApplicationError,
  fail,
  ok,
  type Result,
} from "../../core";

import type {
  AuditEntity,
  AuditEventId,
} from "./audit.entity";

import type {
  AuditRepository,
} from "./audit.repository";

import type {
  AuditListQuery,
  AuditQuery,
  CreateAuditEventInput,
} from "./audit.types";

export class AuditService {
  constructor(
    private readonly auditRepository: AuditRepository,
  ) {}

  async getById(
    auditEventId: AuditEventId,
  ): Promise<Result<AuditEntity, ApplicationError>> {
    const result =
      await this.auditRepository.findById(
        auditEventId,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to retrieve audit event.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "Audit event not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async append(
    input: CreateAuditEventInput,
  ): Promise<Result<AuditEntity, ApplicationError>> {
    const result =
      await this.auditRepository.append(
        input,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to append audit event.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: AuditListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly AuditEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result =
      await this.auditRepository.list(
        query,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to retrieve audit events.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async count(
    query: AuditQuery,
  ): Promise<Result<number, ApplicationError>> {
    const result =
      await this.auditRepository.count(
        query,
      );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message:
            "Unable to count audit events.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }
}
