import {
  ApplicationError,
  fail,
  ok,
  type Result,
  type UserId,
} from "../../core";

import type { UserEntity } from "./user.entity";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserListQuery,
} from "./user.types";
import type { UserRepository } from "./user.repository";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getById(
    userId: UserId,
  ): Promise<Result<UserEntity, ApplicationError>> {
    const result = await this.userRepository.findById(userId);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve user.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "User not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async getByEmail(
    email: string,
  ): Promise<Result<UserEntity, ApplicationError>> {
    const normalizedEmail = email.trim().toLowerCase();

    const result = await this.userRepository.findByEmail(
      normalizedEmail,
    );

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve user.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    if (!result.value) {
      return fail(
        new ApplicationError({
          code: "NOT_FOUND",
          message: "User not found.",
          statusCode: 404,
        }),
      );
    }

    return ok(result.value);
  }

  async create(
    input: CreateUserInput,
  ): Promise<Result<UserEntity, ApplicationError>> {
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();

    const existingUser = await this.userRepository.findByEmail(email);

    if (!existingUser.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to verify user uniqueness.",
          statusCode: 503,
          cause: existingUser.error,
        }),
      );
    }

    if (existingUser.value) {
      return fail(
        new ApplicationError({
          code: "CONFLICT",
          message: "A user with this email already exists.",
          statusCode: 409,
        }),
      );
    }

    const result = await this.userRepository.create({
      email,
      name,
    });

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to create user.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async update(
    userId: UserId,
    input: UpdateUserInput,
  ): Promise<Result<UserEntity, ApplicationError>> {
    const existingUser = await this.getById(userId);

    if (!existingUser.ok) {
      return existingUser;
    }

    const name = input.name?.trim();

    if (name !== undefined && name.length === 0) {
      return fail(
        new ApplicationError({
          code: "VALIDATION_ERROR",
          message: "User name cannot be empty.",
          statusCode: 400,
        }),
      );
    }

    const result = await this.userRepository.update(userId, {
      ...(name !== undefined ? { name } : {}),
    });

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to update user.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async list(
    query: UserListQuery,
  ): Promise<
    Result<
      {
        readonly items: readonly UserEntity[];
        readonly total: number;
      },
      ApplicationError
    >
  > {
    const result = await this.userRepository.list(query);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to retrieve users.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(result.value);
  }

  async delete(
    userId: UserId,
  ): Promise<Result<void, ApplicationError>> {
    const existingUser = await this.getById(userId);

    if (!existingUser.ok) {
      return existingUser;
    }

    const result = await this.userRepository.delete(userId);

    if (!result.ok) {
      return fail(
        new ApplicationError({
          code: "DEPENDENCY_ERROR",
          message: "Unable to delete user.",
          statusCode: 503,
          cause: result.error,
        }),
      );
    }

    return ok(undefined);
  }
}
