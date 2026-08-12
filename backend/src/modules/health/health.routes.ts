import { Router } from "express";

import { HealthController } from "./health.controller";
import type { HealthRepository } from "./health.repository";
import { HealthService } from "./health.service";

export interface HealthRoutesDependencies {
  readonly healthRepository: HealthRepository;
}

export function createHealthRouter(
  dependencies: HealthRoutesDependencies,
): Router {
  const router = Router();

  const healthService = new HealthService(
    dependencies.healthRepository,
  );

  const healthController = new HealthController(
    healthService,
  );

  router.get(
    "/",
    healthController.check.bind(
      healthController,
    ),
  );

  return router;
}
