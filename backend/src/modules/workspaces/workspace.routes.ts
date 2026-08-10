import { Router } from "express";

import { WorkspaceController } from "./workspace.controller";
import type { WorkspaceRepository } from "./workspace.repository";
import { WorkspaceService } from "./workspace.service";

export interface WorkspaceRoutesDependencies {
  readonly workspaceRepository: WorkspaceRepository;
}

export function createWorkspaceRouter(
  dependencies: WorkspaceRoutesDependencies,
): Router {
  const router = Router();

  const workspaceService = new WorkspaceService(
    dependencies.workspaceRepository,
  );

  const workspaceController = new WorkspaceController(
    workspaceService,
  );

  router.get(
    "/",
    workspaceController.list.bind(workspaceController),
  );

  router.post(
    "/",
    workspaceController.create.bind(workspaceController),
  );

  router.get(
    "/:organizationId/:id",
    workspaceController.getById.bind(workspaceController),
  );

  router.patch(
    "/:organizationId/:id",
    workspaceController.update.bind(workspaceController),
  );

  router.delete(
    "/:organizationId/:id",
    workspaceController.delete.bind(workspaceController),
  );

  return router;
}
