import { Router } from "express";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import type { UserRepository } from "./user.repository";

export interface UserRoutesDependencies {
  readonly userRepository: UserRepository;
}

export function createUserRouter(
  dependencies: UserRoutesDependencies,
): Router {
  const router = Router();

  const userService = new UserService(
    dependencies.userRepository,
  );

  const userController = new UserController(userService);

  router.get(
    "/",
    userController.list.bind(userController),
  );

  router.post(
    "/",
    userController.create.bind(userController),
  );

  router.get(
    "/:id",
    userController.getById.bind(userController),
  );

  router.patch(
    "/:id",
    userController.update.bind(userController),
  );

  router.delete(
    "/:id",
    userController.delete.bind(userController),
  );

  return router;
}
