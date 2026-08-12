import type {
  Result,
} from "../../core";

import type {
  HealthEntity,
} from "./health.entity";

export interface HealthRepository {
  getVersion(): Promise<
    Result<string, Error>
  >;

  getUptimeSeconds(): Promise<
    Result<number, Error>
  >;

  runChecks(): Promise<
    Result<
      readonly HealthEntity["checks"],
      Error
    >
  >;
}
