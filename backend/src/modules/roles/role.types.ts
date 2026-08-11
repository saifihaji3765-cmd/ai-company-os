import type {
  ISODateString,
} from "../../core";

import type {
  RoleId,
  RoleKey,
  RoleScope,
  RoleStatus,
} from "./role.entity";

export interface CreateRoleInput {
  readonly key: RoleKey;
  readonly name: string;
  readonly description: string;
  readonly scope: RoleScope;
  readonly systemManaged: boolean;
}

export interface UpdateRoleInput {
  readonly name?: string;
  readonly description?: string;
  readonly scope?: RoleScope;
  readonly status?: RoleStatus;
}

export interface RoleRecord {
  readonly id: RoleId;
  readonly key: RoleKey;
  readonly name: string;
  readonly description: string;
  readonly scope: RoleScope;
  readonly status: RoleStatus;
  readonly systemManaged: boolean;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface RoleSummary {
  readonly id: RoleId;
  readonly key: RoleKey;
  readonly name: string;
  readonly scope: RoleScope;
  readonly status: RoleStatus;
}

export interface RoleQuery {
  readonly id?: RoleId;
  readonly key?: RoleKey;
  readonly scope?: RoleScope;
}

export interface RoleListQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly scope?: RoleScope;
  readonly status?: RoleStatus;
  readonly search?: string;
}

export interface RoleListResult {
  readonly items: readonly RoleSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
