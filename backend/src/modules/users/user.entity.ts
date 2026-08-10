import type {
  ISODateString,
  UserId,
} from "../../core";

export type UserStatus =
  | "active"
  | "suspended"
  | "deactivated";

export interface UserEntityProps {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
  readonly status: UserStatus;
  readonly emailVerifiedAt: ISODateString | null;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export class UserEntity {
  private readonly props: UserEntityProps;

  private constructor(props: UserEntityProps) {
    this.props = Object.freeze({
      ...props,
    });
  }

  static create(props: UserEntityProps): UserEntity {
    UserEntity.validate(props);

    return new UserEntity(props);
  }

  get id(): UserId {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get emailVerifiedAt(): ISODateString | null {
    return this.props.emailVerifiedAt;
  }

  get createdAt(): ISODateString {
    return this.props.createdAt;
  }

  get updatedAt(): ISODateString {
    return this.props.updatedAt;
  }

  get isActive(): boolean {
    return this.props.status === "active";
  }

  get isEmailVerified(): boolean {
    return this.props.emailVerifiedAt !== null;
  }

  toObject(): UserEntityProps {
    return {
      ...this.props,
    };
  }

  private static validate(props: UserEntityProps): void {
    if (!props.id) {
      throw new Error("User ID is required.");
    }

    if (!props.email.trim()) {
      throw new Error("User email is required.");
    }

    if (!props.name.trim()) {
      throw new Error("User name is required.");
    }

    if (!["active", "suspended", "deactivated"].includes(props.status)) {
      throw new Error("Invalid user status.");
    }
  }
}
