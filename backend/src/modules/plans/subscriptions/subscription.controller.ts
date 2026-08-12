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
  SubscriptionId,
} from "./subscription.entity";

import {
  SubscriptionService,
} from "./subscription.service";

import {
  createSubscriptionSchema,
  organizationIdSchema,
  subscriptionIdSchema,
  subscriptionListQuerySchema,
  updateSubscriptionSchema,
} from "./subscription.validators";

export class SubscriptionController {
  constructor(
    private readonly subscriptionService:
      SubscriptionService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const organizationId =
      organizationIdSchema.safeParse(
        req.params.organizationId,
      );

    const subscriptionId =
      subscriptionIdSchema.safeParse(
        req.params.id,
      );

    if (
      !organizationId.success ||
      !subscriptionId.success
    ) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid organization or subscription ID.",
        },
      });

      return;
    }

    const result =
      await this.subscriptionService.getById(
        organizationId.data as OrganizationId,
        subscriptionId.data as SubscriptionId,
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

  async create(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      createSubscriptionSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid subscription data.",
          details:
            parsed.error.flatten()
              .fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.subscriptionService.create(
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

  async update(
    req: Request,
    res: Response,
  ): Promise<void> {
    const organizationId =
      organizationIdSchema.safeParse(
        req.params.organizationId,
      );

    const subscriptionId =
      subscriptionIdSchema.safeParse(
        req.params.id,
      );

    const body =
      updateSubscriptionSchema.safeParse(
        req.body,
      );

    if (
      !organizationId.success ||
      !subscriptionId.success ||
      !body.success
    ) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid subscription data.",
        },
      });

      return;
    }

    const result =
      await this.subscriptionService.update(
        organizationId.data as OrganizationId,
        subscriptionId.data as SubscriptionId,
        body.data,
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

  async list(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsed =
      subscriptionListQuerySchema.safeParse(
        req.query,
      );

    if (!parsed.success) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid subscription query.",
          details:
            parsed.error.flatten()
              .fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.subscriptionService.list(
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
        (subscription) =>
          subscription.toObject(),
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
    const organizationId =
      organizationIdSchema.safeParse(
        req.params.organizationId,
      );

    const subscriptionId =
      subscriptionIdSchema.safeParse(
        req.params.id,
      );

    if (
      !organizationId.success ||
      !subscriptionId.success
    ) {
      res.status(
        HTTP_STATUS.BAD_REQUEST,
      ).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid organization or subscription ID.",
        },
      });

      return;
    }

    const result =
      await this.subscriptionService.delete(
        organizationId.data as OrganizationId,
        subscriptionId.data as SubscriptionId,
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
      HTTP_STATUS.NO_CONTENT,
    ).send();
  }
}
