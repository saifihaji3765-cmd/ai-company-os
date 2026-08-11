import { Router } from "express";

import { PlanController } from "./plan.controller";
import type { PlanRepository } from "./plan.repository";
import { PlanService } from "./plan.service";

export interface PlanRoutesDependencies {
  readonly planRepository: PlanRepository;
}

export function createPlanRouter(
  dependencies: PlanRoutesDependencies,
): Router {
  const router = Router();

  const planService = new PlanService(
    dependencies.planRepository,
  );

  const planController = new PlanController(
    planService,
  );

  router.get(
    "/",
    planController.list.bind(planController),
  );

  router.post(
    "/",
    planController.create.bind(planController),
  );

  router.get(
    "/:id",
    planController.getById.bind(planController),
  );

  router.patch(
    "/:id",
    planController.update.bind(planController),
  );

  router.delete(
    "/:id",
    planController.delete.bind(planController),
  );

  return router;
}
