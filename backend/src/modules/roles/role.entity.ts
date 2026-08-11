import type {
  Brand,
  ISODateString,
} from "../../core";

export type RoleId = Brand<
  string,
  "RoleId"
>;

export type RoleKey =
  | "owner"
  | "operator"
  | "ai_agent"
  | "automation";

export type RoleStatus =
  | "active"
  | "disabled";

export type RoleScope =
  | "platform"
  | "organization"
  | "workspace"
  | "project";

export interface RoleEntityProps {
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

export class RoleEntity {
  private readonly props: RoleEntityProps;

  private constructor(
    props: RoleEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
    });
  }

  static create(
    props: RoleEntityProps,
  ): RoleEntity {
    RoleEntity.validate(props);

    return new RoleEntity(props);
  }

  get id(): RoleId {
    return this.props.id;
  }

  get key(): RoleKey {
    return this.props.key;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get scope(): RoleScope {
    return this.props.scope;
  }

  get status(): RoleStatus {
    return this.props.status;
  }

  get systemManaged(): boolean {
    return this.props.systemManaged;
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

  get isOwnerRole(): boolean {
    return this.props.key === "owner";
  }

  get isSystemManaged(): boolean {
    return this.props.systemManaged;
  }

  toObject(): RoleEntityProps {
    return {
      ...this.props,
    };
  }

  private static validate(
    props: RoleEntityProps,
  ): void {
    if (!props.id) {
      throw new Error("Role ID is required.");
    }

    if (!props.key) {
      throw new Error("Role key is required.");
    }

    if (!props.name.trim()) {
      throw new Error("Role name is required.");
    }

    if (!props.description.trim()) {
      throw new Error(
        "Role description is required.",
      );
    }

    if (
      ![
        "owner",
        "operator",
        "ai_agent",
        "automation",
      ].includes(props.key)
    ) {
      throw new Error("Invalid role key.");
    }

    if (
      ![
        "platform",
        "organization",
        "workspace",
        "project",
      ].includes(props.scope)
    ) {
      throw new Error("Invalid role scope.");
    }

    if (
      ![
        "active",
        "disabled",
      ].includes(props.status)
    ) {
      throw new Error("Invalid role status.");
    }

    if (
      props.key === "owner" &&
      props.scope !== "platform"
    ) {
      throw new Error(
        "Owner role must have platform scope.",
      );
    }
  }
}
