import { Router } from "express";

import { AuditController } from "./audit.controller";
import type { AuditRepository } from "./audit.repository";
import { AuditService } from "./audit.service";

export interface AuditRoutesDependencies {
  readonly auditRepository: AuditRepository;
}

export function createAuditRouter(
  dependencies: AuditRoutesDependencies,
): Router {
  const router = Router();

  const auditService = new AuditService(
    dependencies.auditRepository,
  );

  const auditController = new AuditController(
    auditService,
  );

  router.get(
    "/",
    auditController.list.bind(auditController),
  );

  router.post(
    "/",
    auditController.append.bind(auditController),
  );

  router.get(
    "/count",
    auditController.count.bind(auditController),
  );

  router.get(
    "/:id",
    auditController.getById.bind(auditController),
  );

  return router;
}
