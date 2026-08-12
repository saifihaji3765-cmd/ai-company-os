import type {
  Request,
  Response,
} from "express";

import {
  HTTP_STATUS,
  isFailure,
  type OrganizationId,
} from "../../core";

import type {
  UsageRecordId,
} from "./usage.entity";

import {
  UsageService,
} from "./usage.service";

import {
  organizationIdSchema,
  recordUsageSchema,
  usageListQuerySchema,
  usageQuerySchema,
  usageRecordIdSchema,
} from "./usage.validators";

export class UsageController {
  constructor(
    private readonly usageService: UsageService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const organizationId =
      organizationIdSchema.safeParse(
        req.params.organizationId,
      );

    const usageRecordId =
      usageRecordIdSchema.safeParse(
        req.params.id,
      );

    if (
      !organizationId.success ||
      !usageRecordId.success
    ) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid organization or usage record ID.",
        },
      });

      return;
    }

    const result =
      await this.usageService.getById(
        organizationId.data as OrganizationId,
        usageRecordId.data as UsageRecordId,
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

  async record(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      recordUsageSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid usage data.",
          details:
            parsed.error.flatten()
              .fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.usageService.record(
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
      usageListQuerySchema.safeParse(
        req.query,
      );

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid usage query.",
          details:
            parsed.error.flatten()
              .fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.usageService.list(
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
        (usage) => usage.toObject(),
      ),
      meta: {
        total: result.value.total,
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
      },
    });
  }

  async aggregate(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      usageQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid usage aggregation query.",
          details:
            parsed.error.flatten()
              .fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.usageService.aggregate(
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
      data: result.value?.toObject?.() ??
        result.value,
    });
  }
}
