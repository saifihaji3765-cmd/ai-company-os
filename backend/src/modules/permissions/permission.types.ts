import type {
  ISODateString,
} from "../../core";

import type {
  PermissionAction,
  PermissionId,
  PermissionResource,
  PermissionScope,
  PermissionStatus,
} from "./permission.entity";

export interface CreatePermissionInput {
  readonly resource: PermissionResource;
  readonly action: PermissionAction;
  readonly scope: PermissionScope;
  readonly systemManaged: boolean;
}

export interface UpdatePermissionInput {
  readonly status?: PermissionStatus;
}

export interface PermissionRecord {
  readonly id: PermissionId;
  readonly resource: PermissionResource;
  readonly action: PermissionAction;
  readonly scope: PermissionScope;
  readonly status: PermissionStatus;
  readonly systemManaged: boolean;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface PermissionSummary {
  readonly id: PermissionId;
  readonly resource: PermissionResource;
  readonly action: PermissionAction;
  readonly scope: PermissionScope;
  readonly status: PermissionStatus;
}

export interface PermissionQuery {
  readonly id?: PermissionId;
  readonly resource?: PermissionResource;
  readonly action?: PermissionAction;
  readonly scope?: PermissionScope;
}

export interface PermissionListQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly resource?: PermissionResource;
  readonly action?: PermissionAction;
  readonly scope?: PermissionScope;
  readonly status?: PermissionStatus;
  readonly search?: string;
}

export interface PermissionListResult {
  readonly items: readonly PermissionSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
