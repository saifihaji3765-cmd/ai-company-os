import express, { type Express } from "express";

import { appConfig } from "../config";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: appConfig.name,
      environment: appConfig.environment,
    });
  });

  return app;
}
