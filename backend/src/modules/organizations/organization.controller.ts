import type { Request, Response } from "express";

import {
  HTTP_STATUS,
  isFailure,
  type OrganizationId,
} from "../../core";

import { OrganizationService } from "./organization.service";
import {
  createOrganizationSchema,
  organizationIdSchema,
  organizationListQuerySchema,
  updateOrganizationSchema,
} from "./organization.validators";

export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId = organizationIdSchema.safeParse(
      req.params.id,
    );

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid organization ID.",
        },
      });

      return;
    }

    const result =
      await this.organizationService.getById(
        parsedId.data as OrganizationId,
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
      createOrganizationSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid organization data.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.organizationService.create(parsed.data);

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
    const parsedId = organizationIdSchema.safeParse(
      req.params.id,
    );

    const parsedBody =
      updateOrganizationSchema.safeParse(req.body);

    if (!parsedId.success || !parsedBody.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid organization data.",
        },
      });

      return;
    }

    const result =
      await this.organizationService.update(
        parsedId.data as OrganizationId,
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
      organizationListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid organization query.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.organizationService.list(parsed.data);

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
      data: result.value.items.map((organization) =>
        organization.toObject(),
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
    const parsedId = organizationIdSchema.safeParse(
      req.params.id,
    );

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid organization ID.",
        },
      });

      return;
    }

    const result =
      await this.organizationService.delete(
        parsedId.data as OrganizationId,
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
