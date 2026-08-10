import type {
  Brand,
  ISODateString,
} from "../../core";

import type { OrganizationId } from "../organizations";

export type WorkspaceId = Brand<
  string,
  "WorkspaceId"
>;

export type WorkspaceStatus =
  | "active"
  | "suspended"
  | "archived";

export interface WorkspaceEntityProps {
  readonly id: WorkspaceId;
  readonly organizationId: OrganizationId;
  readonly name: string;
  readonly slug: string;
  readonly status: WorkspaceStatus;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export class WorkspaceEntity {
  private readonly props: WorkspaceEntityProps;

  private constructor(
    props: WorkspaceEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
    });
  }

  static create(
    props: WorkspaceEntityProps,
  ): WorkspaceEntity {
    WorkspaceEntity.validate(props);

    return new WorkspaceEntity(props);
  }

  get id(): WorkspaceId {
    return this.props.id;
  }

  get organizationId(): OrganizationId {
    return this.props.organizationId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get status(): WorkspaceStatus {
    return this.props.status;
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

  get isArchived(): boolean {
    return this.props.status === "archived";
  }

  toObject(): WorkspaceEntityProps {
    return {
      ...this.props,
    };
  }

  private static validate(
    props: WorkspaceEntityProps,
  ): void {
    if (!props.id) {
      throw new Error(
        "Workspace ID is required.",
      );
    }

    if (!props.organizationId) {
      throw new Error(
        "Workspace organization ID is required.",
      );
    }

    if (!props.name.trim()) {
      throw new Error(
        "Workspace name is required.",
      );
    }

    if (!props.slug.trim()) {
      throw new Error(
        "Workspace slug is required.",
      );
    }

    if (
      ![
        "active",
        "suspended",
        "archived",
      ].includes(props.status)
    ) {
      throw new Error(
        "Invalid workspace status.",
      );
    }
  }
}
