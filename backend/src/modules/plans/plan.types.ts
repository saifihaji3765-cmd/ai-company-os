import type {
  ISODateString,
} from "../../core";

import type {
  PlanCapabilities,
  PlanId,
  PlanKey,
  PlanLimits,
  PlanScope,
  PlanStatus,
} from "./plan.entity";

export interface CreatePlanInput {
  readonly key: PlanKey;
  readonly name: string;
  readonly description: string;
  readonly scope: PlanScope;
  readonly capabilities: PlanCapabilities;
  readonly limits: PlanLimits;
  readonly systemManaged: boolean;
}

export interface UpdatePlanInput {
  readonly name?: string;
  readonly description?: string;
  readonly status?: PlanStatus;
  readonly capabilities?: PlanCapabilities;
  readonly limits?: PlanLimits;
}

export interface PlanRecord {
  readonly id: PlanId;
  readonly key: PlanKey;
  readonly name: string;
  readonly description: string;
  readonly scope: PlanScope;
  readonly status: PlanStatus;
  readonly capabilities: PlanCapabilities;
  readonly limits: PlanLimits;
  readonly systemManaged: boolean;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface PlanSummary {
  readonly id: PlanId;
  readonly key: PlanKey;
  readonly name: string;
  readonly scope: PlanScope;
  readonly status: PlanStatus;
}

export interface PlanQuery {
  readonly id?: PlanId;
  readonly key?: PlanKey;
  readonly scope?: PlanScope;
  readonly status?: PlanStatus;
}

export interface PlanListQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly scope?: PlanScope;
  readonly status?: PlanStatus;
  readonly search?: string;
}

export interface PlanListResult {
  readonly items: readonly PlanSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
