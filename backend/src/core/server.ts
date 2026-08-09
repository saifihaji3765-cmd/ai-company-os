import type { Server } from "node:http";

import { appConfig } from "../config";
import { createApp } from "./app";

export function createServer(): Server {
  const app = createApp();

  return app.listen(appConfig.server.port);
}
