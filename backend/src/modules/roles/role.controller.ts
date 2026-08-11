import type { Request, Response } from "express";

import {
  HTTP_STATUS,
  isFailure,
  type RoleId,
} from "../../core";

import { RoleService } from "./role.service";
import {
  createRoleSchema,
  roleIdSchema,
  roleListQuerySchema,
  updateRoleSchema,
} from "./role.validators";

export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId = roleIdSchema.safeParse(
      req.params.id,
    );

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid role ID.",
        },
      });

      return;
    }

    const result =
      await this.roleService.getById(
        parsedId.data as RoleId,
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
      createRoleSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid role data.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.roleService.create(parsed.data);

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
    const parsedId = roleIdSchema.safeParse(
      req.params.id,
    );

    const parsedBody =
      updateRoleSchema.safeParse(req.body);

    if (
      !parsedId.success ||
      !parsedBody.success
    ) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid role data.",
        },
      });

      return;
    }

    const result =
      await this.roleService.update(
        parsedId.data as RoleId,
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
      roleListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid role query.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.roleService.list(parsed.data);

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
      data: result.value.items.map((role) =>
        role.toObject(),
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
    const parsedId = roleIdSchema.safeParse(
      req.params.id,
    );

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid role ID.",
        },
      });

      return;
    }

    const result =
      await this.roleService.delete(
        parsedId.data as RoleId,
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
