import type {
  Brand,
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  WorkspaceId,
} from "../workspaces";

export type ProjectId = Brand<
  string,
  "ProjectId"
>;

export type ProjectStatus =
  | "active"
  | "suspended"
  | "archived";

export interface ProjectEntityProps {
  readonly id: ProjectId;
  readonly organizationId: OrganizationId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly slug: string;
  readonly status: ProjectStatus;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export class ProjectEntity {
  private readonly props: ProjectEntityProps;

  private constructor(
    props: ProjectEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
    });
  }

  static create(
    props: ProjectEntityProps,
  ): ProjectEntity {
    ProjectEntity.validate(props);

    return new ProjectEntity(props);
  }

  get id(): ProjectId {
    return this.props.id;
  }

  get organizationId(): OrganizationId {
    return this.props.organizationId;
  }

  get workspaceId(): WorkspaceId {
    return this.props.workspaceId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get status(): ProjectStatus {
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

  toObject(): ProjectEntityProps {
    return {
      ...this.props,
    };
  }

  private static validate(
    props: ProjectEntityProps,
  ): void {
    if (!props.id) {
      throw new Error(
        "Project ID is required.",
      );
    }

    if (!props.organizationId) {
      throw new Error(
        "Project organization ID is required.",
      );
    }

    if (!props.workspaceId) {
      throw new Error(
        "Project workspace ID is required.",
      );
    }

    if (!props.name.trim()) {
      throw new Error(
        "Project name is required.",
      );
    }

    if (!props.slug.trim()) {
      throw new Error(
        "Project slug is required.",
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
        "Invalid project status.",
      );
    }
  }
}
