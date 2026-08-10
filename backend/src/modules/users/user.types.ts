import type {
  ISODateString,
  UserId,
} from "../../core";

import type { UserStatus } from "./user.entity";

export interface CreateUserInput {
  readonly email: string;
  readonly name: string;
}

export interface UpdateUserInput {
  readonly name?: string;
}

export interface UserRecord {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
  readonly status: UserStatus;
  readonly emailVerifiedAt: ISODateString | null;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface UserSummary {
  readonly id: UserId;
  readonly name: string;
  readonly status: UserStatus;
}

export interface UserQuery {
  readonly id?: UserId;
  readonly email?: string;
}

export interface UserListQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly status?: UserStatus;
  readonly search?: string;
}

export interface UserListResult {
  readonly items: readonly UserSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
