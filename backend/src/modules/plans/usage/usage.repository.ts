import type {
  Result,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  UsageEntity,
  UsageRecordId,
} from "./usage.entity";

import type {
  RecordUsageInput,
  UsageAggregate,
  UsageListQuery,
  UsageQuery,
} from "./usage.types";

export interface UsageRepository {
  findById(
    organizationId: OrganizationId,
    usageRecordId: UsageRecordId,
  ): Promise<Result<UsageEntity | null, Error>>;

  record(
    input: RecordUsageInput,
  ): Promise<Result<UsageEntity, Error>>;

  list(
    query: UsageListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly UsageEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  aggregate(
    query: UsageQuery,
  ): Promise<
    Result<UsageAggregate | null, Error>
  >;
}
