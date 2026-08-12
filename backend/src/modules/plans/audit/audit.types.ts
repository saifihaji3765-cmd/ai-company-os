import type {
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

import type {
  AuditActorType,
  AuditEntityProps,
  AuditEventAction,
  AuditEventId,
  AuditEventOutcome,
  AuditEventResource,
} from "./audit.entity";

export interface CreateAuditEventInput {
  readonly organizationId: OrganizationId | null;
  readonly actorId: string | null;
  readonly actorType: AuditActorType;
  readonly action: AuditEventAction;
  readonly resource: AuditEventResource;
  readonly resourceId: string | null;
  readonly outcome: AuditEventOutcome;
  readonly metadata?: Readonly<
    Record<string, unknown>
  >;
  readonly occurredAt: ISODateString;
}

export interface AuditEventRecord
  extends AuditEntityProps {}

export interface AuditQuery {
  readonly organizationId?: OrganizationId;
  readonly actorId?: string;
  readonly actorType?: AuditActorType;
  readonly action?: AuditEventAction;
  readonly resource?: AuditEventResource;
  readonly resourceId?: string;
  readonly outcome?: AuditEventOutcome;
  readonly from?: ISODateString;
  readonly to?: ISODateString;
}

export interface AuditListQuery
  extends AuditQuery {
  readonly page: number;
  readonly pageSize: number;
}

export interface AuditListResult {
  readonly items: readonly AuditEventRecord[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface AuditEventSummary {
  readonly id: AuditEventId;
  readonly actorType: AuditActorType;
  readonly action: AuditEventAction;
  readonly resource: AuditEventResource;
  readonly outcome: AuditEventOutcome;
  readonly occurredAt: ISODateString;
}
