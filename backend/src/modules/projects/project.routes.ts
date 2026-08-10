import { Router } from "express";

import { ProjectController } from "./project.controller";
import type { ProjectRepository } from "./project.repository";
import { ProjectService } from "./project.service";

export interface ProjectRoutesDependencies {
  readonly projectRepository: ProjectRepository;
}

export function createProjectRouter(
  dependencies: ProjectRoutesDependencies,
): Router {
  const router = Router();

  const projectService = new ProjectService(
    dependencies.projectRepository,
  );

  const projectController = new ProjectController(
    projectService,
  );

  router.get(
    "/",
    projectController.list.bind(projectController),
  );

  router.post(
    "/",
    projectController.create.bind(projectController),
  );

  router.get(
    "/:organizationId/:workspaceId/:id",
    projectController.getById.bind(projectController),
  );

  router.patch(
    "/:organizationId/:workspaceId/:id",
    projectController.update.bind(projectController),
  );

  router.delete(
    "/:organizationId/:workspaceId/:id",
    projectController.delete.bind(projectController),
  );

  return router;
}
