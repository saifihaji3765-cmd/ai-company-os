import type { Request, Response } from "express";

import {
  HTTP_STATUS,
  isFailure,
  type OrganizationId,
} from "../../core";

import { WorkspaceService } from "./workspace.service";
import type { WorkspaceId } from "./workspace.entity";

import {
  createWorkspaceSchema,
  organizationIdSchema,
  workspaceIdSchema,
  workspaceListQuerySchema,
  updateWorkspaceSchema,
} from "./workspace.validators";

export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const organizationId = organizationIdSchema.safeParse(
      req.params.organizationId,
    );

    const workspaceId = workspaceIdSchema.safeParse(
      req.params.id,
    );

    if (!organizationId.success || !workspaceId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid organization or workspace ID.",
        },
      });

      return;
    }

    const result = await this.workspaceService.getById(
      organizationId.data as OrganizationId,
      workspaceId.data as WorkspaceId,
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
    const parsed = createWorkspaceSchema.safeParse(
      req.body,
    );

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid workspace data.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.workspaceService.create(parsed.data);

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
    const organizationId = organizationIdSchema.safeParse(
      req.params.organizationId,
    );

    const workspaceId = workspaceIdSchema.safeParse(
      req.params.id,
    );

    const body = updateWorkspaceSchema.safeParse(
      req.body,
    );

    if (
      !organizationId.success ||
      !workspaceId.success ||
      !body.success
    ) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid workspace data.",
        },
      });

      return;
    }

    const result =
      await this.workspaceService.update(
        organizationId.data as OrganizationId,
        workspaceId.data as WorkspaceId,
        body.data,
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
      workspaceListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid workspace query.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.workspaceService.list(parsed.data);

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
      data: result.value.items.map((workspace) =>
        workspace.toObject(),
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
    const organizationId = organizationIdSchema.safeParse(
      req.params.organizationId,
    );

    const workspaceId = workspaceIdSchema.safeParse(
      req.params.id,
    );

    if (!organizationId.success || !workspaceId.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid organization or workspace ID.",
        },
      });

      return;
    }

    const result =
      await this.workspaceService.delete(
        organizationId.data as OrganizationId,
        workspaceId.data as WorkspaceId,
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
