import { Router } from "express";

import { UsageController } from "./usage.controller";
import type { UsageRepository } from "./usage.repository";
import { UsageService } from "./usage.service";

export interface UsageRoutesDependencies {
  readonly usageRepository: UsageRepository;
}

export function createUsageRouter(
  dependencies: UsageRoutesDependencies,
): Router {
  const router = Router();

  const usageService = new UsageService(
    dependencies.usageRepository,
  );

  const usageController = new UsageController(
    usageService,
  );

  router.get(
    "/",
    usageController.list.bind(
      usageController,
    ),
  );

  router.post(
    "/",
    usageController.record.bind(
      usageController,
    ),
  );

  router.get(
    "/aggregate",
    usageController.aggregate.bind(
      usageController,
    ),
  );

  router.get(
    "/:organizationId/:id",
    usageController.getById.bind(
      usageController,
    ),
  );

  return router;
}
