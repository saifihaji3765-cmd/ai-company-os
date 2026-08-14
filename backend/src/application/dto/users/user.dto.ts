import type {
  UserId,
} from "../../../modules/users";

export interface UserDto {
  readonly id: UserId;
  readonly name: string;
  readonly email: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
