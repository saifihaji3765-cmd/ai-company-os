import type { Result, UserId } from "../../core";

import type { UserEntity } from "./user.entity";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserListQuery,
} from "./user.types";

export interface UserRepository {
  findById(
    userId: UserId,
  ): Promise<Result<UserEntity | null, Error>>;

  findByEmail(
    email: string,
  ): Promise<Result<UserEntity | null, Error>>;

  list(
    query: UserListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly UserEntity[];
        readonly total: number;
      },
      Error
    >
  >;

  create(
    input: CreateUserInput,
  ): Promise<Result<UserEntity, Error>>;

  update(
    userId: UserId,
    input: UpdateUserInput,
  ): Promise<Result<UserEntity, Error>>;

  delete(
    userId: UserId,
  ): Promise<Result<void, Error>>;
}
