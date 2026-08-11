import type { Request, Response } from "express";

import {
  HTTP_STATUS,
  isFailure,
  type PlanId,
} from "../../core";

import { PlanService } from "./plan.service";

import {
  createPlanSchema,
  planIdSchema,
  planListQuerySchema,
  updatePlanSchema,
} from "./plan.validators";

export class PlanController {
  constructor(
    private readonly planService: PlanService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId = planIdSchema.safeParse(
      req.params.id,
    );

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid plan ID.",
        },
      });

      return;
    }

    const result =
      await this.planService.getById(
        parsedId.data as PlanId,
      );

    if (isFailure(result)) {
      res.status(result.error.statusCode).json({
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

  async create(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      createPlanSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid plan data.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.planService.create(parsed.data);

    if (isFailure(result)) {
      res.status(result.error.statusCode).json({
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      });

      return;
    }

    res.status(HTTP_STATUS.CREATED).json({
      data: result.value.toObject(),
    });
  }

  async update(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId = planIdSchema.safeParse(
      req.params.id,
    );

    const parsedBody =
      updatePlanSchema.safeParse(req.body);

    if (
      !parsedId.success ||
      !parsedBody.success
    ) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid plan data.",
        },
      });

      return;
    }

    const result =
      await this.planService.update(
        parsedId.data as PlanId,
        parsedBody.data,
      );

    if (isFailure(result)) {
      res.status(result.error.statusCode).json({
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

  async list(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      planListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid plan query.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.planService.list(parsed.data);

    if (isFailure(result)) {
      res.status(result.error.statusCode).json({
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      });

      return;
    }

    res.status(HTTP_STATUS.OK).json({
      data: result.value.items.map(
        (plan) => plan.toObject(),
      ),
      meta: {
        total: result.value.total,
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
      },
    });
  }

  async delete(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId = planIdSchema.safeParse(
      req.params.id,
    );

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid plan ID.",
        },
      });

      return;
    }

    const result =
      await this.planService.delete(
        parsedId.data as PlanId,
      );

    if (isFailure(result)) {
      res.status(result.error.statusCode).json({
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      });

      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}
