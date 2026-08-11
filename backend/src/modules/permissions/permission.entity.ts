import type {
  Brand,
  ISODateString,
} from "../../core";

export type PermissionId = Brand<
  string,
  "PermissionId"
>;

export type PermissionResource =
  | "organization"
  | "workspace"
  | "project"
  | "agent"
  | "mission"
  | "workflow"
  | "memory"
  | "integration"
  | "artifact"
  | "system";

export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "execute"
  | "manage";

export type PermissionScope =
  | "platform"
  | "organization"
  | "workspace"
  | "project";

export type PermissionStatus =
  | "active"
  | "disabled";

export interface PermissionEntityProps {
  readonly id: PermissionId;
  readonly resource: PermissionResource;
  readonly action: PermissionAction;
  readonly scope: PermissionScope;
  readonly status: PermissionStatus;
  readonly systemManaged: boolean;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export class PermissionEntity {
  private readonly props: PermissionEntityProps;

  private constructor(
    props: PermissionEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
    });
  }

  static create(
    props: PermissionEntityProps,
  ): PermissionEntity {
    PermissionEntity.validate(props);

    return new PermissionEntity(props);
  }

  get id(): PermissionId {
    return this.props.id;
  }

  get resource(): PermissionResource {
    return this.props.resource;
  }

  get action(): PermissionAction {
    return this.props.action;
  }

  get scope(): PermissionScope {
    return this.props.scope;
  }

  get status(): PermissionStatus {
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

  get isSystemManaged(): boolean {
    return this.props.systemManaged;
  }

  get key(): string {
    return `${this.props.resource}.${this.props.action}.${this.props.scope}`;
  }

  toObject(): PermissionEntityProps {
    return {
      ...this.props,
    };
  }

  private static validate(
    props: PermissionEntityProps,
  ): void {
    if (!props.id) {
      throw new Error(
        "Permission ID is required.",
      );
    }

    if (!props.resource) {
      throw new Error(
        "Permission resource is required.",
      );
    }

    if (!props.action) {
      throw new Error(
        "Permission action is required.",
      );
    }

    if (!props.scope) {
      throw new Error(
        "Permission scope is required.",
      );
    }

    if (
      ![
        "organization",
        "workspace",
        "project",
        "agent",
        "mission",
        "workflow",
        "memory",
        "integration",
        "artifact",
        "system",
      ].includes(props.resource)
    ) {
      throw new Error(
        "Invalid permission resource.",
      );
    }

    if (
      ![
        "create",
        "read",
        "update",
        "delete",
        "execute",
        "manage",
      ].includes(props.action)
    ) {
      throw new Error(
        "Invalid permission action.",
      );
    }

    if (
      ![
        "platform",
        "organization",
        "workspace",
        "project",
      ].includes(props.scope)
    ) {
      throw new Error(
        "Invalid permission scope.",
      );
    }

    if (
      ![
        "active",
        "disabled",
      ].includes(props.status)
    ) {
      throw new Error(
        "Invalid permission status.",
      );
    }

    if (
      props.resource === "system" &&
      props.scope !== "platform"
    ) {
      throw new Error(
        "System permissions must use platform scope.",
      );
    }
  }
}
