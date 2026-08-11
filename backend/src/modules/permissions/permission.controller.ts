import type { Request, Response } from "express";

import {
  HTTP_STATUS,
  isFailure,
  type PermissionId,
} from "../../core";

import { PermissionService } from "./permission.service";

import {
  createPermissionSchema,
  permissionIdSchema,
  permissionListQuerySchema,
  updatePermissionSchema,
} from "./permission.validators";

export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId = permissionIdSchema.safeParse(
      req.params.id,
    );

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid permission ID.",
        },
      });

      return;
    }

    const result =
      await this.permissionService.getById(
        parsedId.data as PermissionId,
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
      createPermissionSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid permission data.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.permissionService.create(
        parsed.data,
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

    res.status(HTTP_STATUS.CREATED).json({
      data: result.value.toObject(),
    });
  }

  async update(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId = permissionIdSchema.safeParse(
      req.params.id,
    );

    const parsedBody =
      updatePermissionSchema.safeParse(req.body);

    if (
      !parsedId.success ||
      !parsedBody.success
    ) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid permission data.",
        },
      });

      return;
    }

    const result =
      await this.permissionService.update(
        parsedId.data as PermissionId,
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
      permissionListQuerySchema.safeParse(
        req.query,
      );

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid permission query.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.permissionService.list(
        parsed.data,
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
      data: result.value.items.map(
        (permission) =>
          permission.toObject(),
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
    const parsedId = permissionIdSchema.safeParse(
      req.params.id,
    );

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid permission ID.",
        },
      });

      return;
    }

    const result =
      await this.permissionService.delete(
        parsedId.data as PermissionId,
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
