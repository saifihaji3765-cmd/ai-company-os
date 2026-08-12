import type {
  Brand,
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

export type AuditEventId = Brand<
  string,
  "AuditEventId"
>;

export type AuditEventAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "execute"
  | "login"
  | "logout"
  | "authorize"
  | "deny";

export type AuditEventResource =
  | "user"
  | "organization"
  | "workspace"
  | "project"
  | "role"
  | "permission"
  | "plan"
  | "subscription"
  | "usage"
  | "agent"
  | "mission"
  | "workflow"
  | "memory"
  | "integration"
  | "system";

export type AuditActorType =
  | "owner"
  | "user"
  | "ai_agent"
  | "automation"
  | "system";

export type AuditEventOutcome =
  | "success"
  | "failure"
  | "denied";

export interface AuditEntityProps {
  readonly id: AuditEventId;
  readonly organizationId: OrganizationId | null;
  readonly actorId: string | null;
  readonly actorType: AuditActorType;
  readonly action: AuditEventAction;
  readonly resource: AuditEventResource;
  readonly resourceId: string | null;
  readonly outcome: AuditEventOutcome;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly occurredAt: ISODateString;
  readonly createdAt: ISODateString;
}

export class AuditEntity {
  private readonly props: AuditEntityProps;

  private constructor(
    props: AuditEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
      metadata: Object.freeze({
        ...props.metadata,
      }),
    });
  }

  static create(
    props: AuditEntityProps,
  ): AuditEntity {
    AuditEntity.validate(props);

    return new AuditEntity(props);
  }

  get id(): AuditEventId {
    return this.props.id;
  }

  get organizationId(): OrganizationId | null {
    return this.props.organizationId;
  }

  get actorId(): string | null {
    return this.props.actorId;
  }

  get actorType(): AuditActorType {
    return this.props.actorType;
  }

  get action(): AuditEventAction {
    return this.props.action;
  }

  get resource(): AuditEventResource {
    return this.props.resource;
  }

  get resourceId(): string | null {
    return this.props.resourceId;
  }

  get outcome(): AuditEventOutcome {
    return this.props.outcome;
  }

  get metadata(): Readonly<Record<string, unknown>> {
    return this.props.metadata;
  }

  get occurredAt(): ISODateString {
    return this.props.occurredAt;
  }

  get createdAt(): ISODateString {
    return this.props.createdAt;
  }

  toObject(): AuditEntityProps {
    return {
      ...this.props,
      metadata: {
        ...this.props.metadata,
      },
    };
  }

  private static validate(
    props: AuditEntityProps,
  ): void {
    if (!props.id) {
      throw new Error(
        "Audit event ID is required.",
      );
    }

    if (
      ![
        "owner",
        "user",
        "ai_agent",
        "automation",
        "system",
      ].includes(props.actorType)
    ) {
      throw new Error(
        "Invalid audit actor type.",
      );
    }

    if (
      ![
        "create",
        "read",
        "update",
        "delete",
        "execute",
        "login",
        "logout",
        "authorize",
        "deny",
      ].includes(props.action)
    ) {
      throw new Error(
        "Invalid audit action.",
      );
    }

    if (
      ![
        "user",
        "organization",
        "workspace",
        "project",
        "role",
        "permission",
        "plan",
        "subscription",
        "usage",
        "agent",
        "mission",
        "workflow",
        "memory",
        "integration",
        "system",
      ].includes(props.resource)
    ) {
      throw new Error(
        "Invalid audit resource.",
      );
    }

    if (
      ![
        "success",
        "failure",
        "denied",
      ].includes(props.outcome)
    ) {
      throw new Error(
        "Invalid audit outcome.",
      );
    }
  }
}
