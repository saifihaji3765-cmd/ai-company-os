import type { Request, Response } from "express";

import {
  HTTP_STATUS,
  isFailure,
  type OrganizationId,
} from "../../core";

import type { WorkspaceId } from "../workspaces";

import type { ProjectId } from "./project.entity";
import { ProjectService } from "./project.service";

import {
  createProjectSchema,
  organizationIdSchema,
  projectIdSchema,
  projectListQuerySchema,
  updateProjectSchema,
  workspaceIdSchema,
} from "./project.validators";

export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  async getById(
    req: Request,
    res: Response,
  ): Promise<void> {
    const organizationId = organizationIdSchema.safeParse(
      req.params.organizationId,
    );

    const workspaceId = workspaceIdSchema.safeParse(
      req.params.workspaceId,
    );

    const projectId = projectIdSchema.safeParse(
      req.params.id,
    );

    if (
      !organizationId.success ||
      !workspaceId.success ||
      !projectId.success
    ) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid organization, workspace, or project ID.",
        },
      });

      return;
    }

    const result =
      await this.projectService.getById(
        organizationId.data as OrganizationId,
        workspaceId.data as WorkspaceId,
        projectId.data as ProjectId,
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
    const parsed = createProjectSchema.safeParse(
      req.body,
    );

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid project data.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.projectService.create(parsed.data);

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
      req.params.workspaceId,
    );

    const projectId = projectIdSchema.safeParse(
      req.params.id,
    );

    const body = updateProjectSchema.safeParse(
      req.body,
    );

    if (
      !organizationId.success ||
      !workspaceId.success ||
      !projectId.success ||
      !body.success
    ) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid project data.",
        },
      });

      return;
    }

    const result =
      await this.projectService.update(
        organizationId.data as OrganizationId,
        workspaceId.data as WorkspaceId,
        projectId.data as ProjectId,
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
      projectListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid project query.",
          details: parsed.error.flatten().fieldErrors,
        },
      });

      return;
    }

    const result =
      await this.projectService.list(parsed.data);

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
      data: result.value.items.map((project) =>
        project.toObject(),
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
      req.params.workspaceId,
    );

    const projectId = projectIdSchema.safeParse(
      req.params.id,
    );

    if (
      !organizationId.success ||
      !workspaceId.success ||
      !projectId.success
    ) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Invalid organization, workspace, or project ID.",
        },
      });

      return;
    }

    const result =
      await this.projectService.delete(
        organizationId.data as OrganizationId,
        workspaceId.data as WorkspaceId,
        projectId.data as ProjectId,
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
