import { Router } from "express";

import { OrganizationController } from "./organization.controller";
import type { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";

export interface OrganizationRoutesDependencies {
  readonly organizationRepository: OrganizationRepository;
}

export function createOrganizationRouter(
  dependencies: OrganizationRoutesDependencies,
): Router {
  const router = Router();

  const organizationService =
    new OrganizationService(
      dependencies.organizationRepository,
    );

  const organizationController =
    new OrganizationController(
      organizationService,
    );

  router.get(
    "/",
    organizationController.list.bind(
      organizationController,
    ),
  );

  router.post(
    "/",
    organizationController.create.bind(
      organizationController,
    ),
  );

  router.get(
    "/:id",
    organizationController.getById.bind(
      organizationController,
    ),
  );

  router.patch(
    "/:id",
    organizationController.update.bind(
      organizationController,
    ),
  );

  router.delete(
    "/:id",
    organizationController.delete.bind(
      organizationController,
    ),
  );

  return router;
}
