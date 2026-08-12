import type {
  Request,
  Response,
} from "express";

import {
  HTTP_STATUS,
  isFailure,
} from "../../core";

import {
  healthResponseSchema,
} from "./health.validators";

import {
  HealthService,
} from "./health.service";

export class HealthController {
  constructor(
    private readonly healthService:
      HealthService,
  ) {}

  async check(
    _req: Request,
    res: Response,
  ): Promise<void> {
    const result =
      await this.healthService.check();

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

    const response =
      result.value.toObject();

    const parsed =
      healthResponseSchema.safeParse(
        response,
      );

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ).json({
        error: {
          code: "INTERNAL_ERROR",
          message:
            "Health response failed validation.",
        },
      });

      return;
    }

    const statusCode =
      result.value.status === "healthy"
        ? HTTP_STATUS.OK
        : HTTP_STATUS.SERVICE_UNAVAILABLE;

    res.status(statusCode).json({
      data: parsed.data,
    });
  }
}
