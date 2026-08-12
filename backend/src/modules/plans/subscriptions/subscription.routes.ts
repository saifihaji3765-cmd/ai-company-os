import { Router } from "express";

import { SubscriptionController } from "./subscription.controller";
import type { SubscriptionRepository } from "./subscription.repository";
import { SubscriptionService } from "./subscription.service";

export interface SubscriptionRoutesDependencies {
  readonly subscriptionRepository: SubscriptionRepository;
}

export function createSubscriptionRouter(
  dependencies: SubscriptionRoutesDependencies,
): Router {
  const router = Router();

  const subscriptionService =
    new SubscriptionService(
      dependencies.subscriptionRepository,
    );

  const subscriptionController =
    new SubscriptionController(
      subscriptionService,
    );

  router.get(
    "/",
    subscriptionController.list.bind(
      subscriptionController,
    ),
  );

  router.post(
    "/",
    subscriptionController.create.bind(
      subscriptionController,
    ),
  );

  router.get(
    "/:organizationId/:id",
    subscriptionController.getById.bind(
      subscriptionController,
    ),
  );

  router.patch(
    "/:organizationId/:id",
    subscriptionController.update.bind(
      subscriptionController,
    ),
  );

  router.delete(
    "/:organizationId/:id",
    subscriptionController.delete.bind(
      subscriptionController,
    ),
  );

  return router;
}
