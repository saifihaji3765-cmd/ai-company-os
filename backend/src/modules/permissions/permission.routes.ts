import { Router } from "express";

import { PermissionController } from "./permission.controller";
import type { PermissionRepository } from "./permission.repository";
import { PermissionService } from "./permission.service";

export interface PermissionRoutesDependencies {
  readonly permissionRepository: PermissionRepository;
}

export function createPermissionRouter(
  dependencies: PermissionRoutesDependencies,
): Router {
  const router = Router();

  const permissionService =
    new PermissionService(
      dependencies.permissionRepository,
    );

  const permissionController =
    new PermissionController(
      permissionService,
    );

  router.get(
    "/",
    permissionController.list.bind(
      permissionController,
    ),
  );

  router.post(
    "/",
    permissionController.create.bind(
      permissionController,
    ),
  );

  router.get(
    "/:id",
    permissionController.getById.bind(
      permissionController,
    ),
  );

  router.patch(
    "/:id",
    permissionController.update.bind(
      permissionController,
    ),
  );

  router.delete(
    "/:id",
    permissionController.delete.bind(
      permissionController,
    ),
  );

  return router;
}
