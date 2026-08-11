import { Router } from "express";

import { RoleController } from "./role.controller";
import type { RoleRepository } from "./role.repository";
import { RoleService } from "./role.service";

export interface RoleRoutesDependencies {
  readonly roleRepository: RoleRepository;
}

export function createRoleRouter(
  dependencies: RoleRoutesDependencies,
): Router {
  const router = Router();

  const roleService = new RoleService(
    dependencies.roleRepository,
  );

  const roleController = new RoleController(
    roleService,
  );

  router.get(
    "/",
    roleController.list.bind(roleController),
  );

  router.post(
    "/",
    roleController.create.bind(roleController),
  );

  router.get(
    "/:id",
    roleController.getById.bind(roleController),
  );

  router.patch(
    "/:id",
    roleController.update.bind(roleController),
  );

  router.delete(
    "/:id",
    roleController.delete.bind(roleController),
  );

  return router;
}
