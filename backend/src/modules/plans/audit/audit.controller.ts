import type {
  Request,
  Response,
} from "express";

import {
  HTTP_STATUS,
  isFailure,
} from "../../core";

import type {
  AuditEventId,
} from "./audit.entity";

import {
  AuditService,
} from "./audit.service";

import {
  auditEventIdSchema,
  auditListQuerySchema,
  auditQuerySchema,
  createAuditEventSchema,
} from "./audit.validators";

export class AuditController {
  constructor(
    private readonly auditService:
      AuditService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId =
      auditEventIdSchema.safeParse(
        req.params.id,
      );

    if (!parsedId.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid audit event ID.",
        },
      });

      return;
    }

    const result =
      await this.auditService.getById(
        parsedId.data as AuditEventId,
      );

    if (isFailure(result)) {
      res.status(
        result.error.statusCode,
      ).json({
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      });

      return;
    }

    res.status(HTTP_STATUS.OK).json({
      data: result.value.toObject(),
    });
  }

  async append(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      createAuditEventSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid audit event.",
          details:
            parsed.error.flatten()
              .fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.auditService.append(
        parsed.data,
      );

    if (isFailure(result)) {
      res.status(
        result.error.statusCode,
      ).json({
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      });

      return;
    }

    res.status(
      HTTP_STATUS.CREATED,
    ).json({
      data: result.value.toObject(),
    });
  }

  async list(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      auditListQuerySchema.safeParse(
        req.query,
      );

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid audit query.",
          details:
            parsed.error.flatten()
              .fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.auditService.list(
        parsed.data,
      );

    if (isFailure(result)) {
      res.status(
        result.error.statusCode,
      ).json({
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      });

      return;
    }

    res.status(HTTP_STATUS.OK).json({
      data: result.value.items.map(
        (event) => event.toObject(),
      ),
      meta: {
        total: result.value.total,
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
      },
    });
  }

  async count(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      auditQuerySchema.safeParse(
        req.query,
      );

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid audit query.",
        },
      });

      return;
    }

    const result =
      await this.auditService.count(
        parsed.data,
      );

    if (isFailure(result)) {
      res.status(
        result.error.statusCode,
      ).json({
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      });

      return;
    }

    res.status(HTTP_STATUS.OK).json({
      data: {
        count: result.value,
      },
    });
  }
}
