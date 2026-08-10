import type { Request, Response } from "express";

import {
  HTTP_STATUS,
  isFailure,
  type UserId,
} from "../../core";

import { UserService } from "./user.service";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  userListQuerySchema,
} from "./user.validators";

export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const parsedId = userIdSchema.safeParse(req.params.id);

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid user ID.",
        },
      });

      return;
    }

    const result = await this.userService.getById(
      parsedId.data as UserId,
    );

    if (isFailure(result)) {
      res.status(result.error.statusCode).json({
        error: {
          code: result.error.code,
          message: result.error.message,
          ...(result.error.details
            ? { details: result.error.details }
            : {}),
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
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid user data.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result = await this.userService.create(parsed.data);

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
    const parsedId = userIdSchema.safeParse(req.params.id);
    const parsedBody = updateUserSchema.safeParse(req.body);

    if (!parsedId.success || !parsedBody.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid user data.",
        },
      });

      return;
    }

    const result = await this.userService.update(
      parsedId.data as UserId,
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
    const parsed = userListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid user query.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result = await this.userService.list(parsed.data);

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
      data: result.value.items.map((user) => user.toObject()),
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
    const parsedId = userIdSchema.safeParse(req.params.id);

    if (!parsedId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid user ID.",
        },
      });

      return;
    }

    const result = await this.userService.delete(
      parsedId.data as UserId,
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
