import type {
  Brand,
  ISODateString,
} from "../../core";

import type {
  OrganizationId,
} from "../organizations";

export type UsageRecordId = Brand<
  string,
  "UsageRecordId"
>;

export type UsageResource =
  | "agent_execution"
  | "mission_execution"
  | "workflow_execution"
  | "memory_entry"
  | "storage"
  | "api_request";

export type UsageUnit =
  | "count"
  | "bytes"
  | "requests";

export interface UsageEntityProps {
  readonly id: UsageRecordId;
  readonly organizationId: OrganizationId;
  readonly resource: UsageResource;
  readonly unit: UsageUnit;
  readonly quantity: number;
  readonly occurredAt: ISODateString;
  readonly createdAt: ISODateString;
}

export class UsageEntity {
  private readonly props: UsageEntityProps;

  private constructor(
    props: UsageEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
    });
  }

  static create(
    props: UsageEntityProps,
  ): UsageEntity {
    UsageEntity.validate(props);

    return new UsageEntity(props);
  }

  get id(): UsageRecordId {
    return this.props.id;
  }

  get organizationId(): OrganizationId {
    return this.props.organizationId;
  }

  get resource(): UsageResource {
    return this.props.resource;
  }

  get unit(): UsageUnit {
    return this.props.unit;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get occurredAt(): ISODateString {
    return this.props.occurredAt;
  }

  get createdAt(): ISODateString {
    return this.props.createdAt;
  }

  toObject(): UsageEntityProps {
    return {
      ...this.props,
    };
  }

  private static validate(
    props: UsageEntityProps,
  ): void {
    if (!props.id) {
      throw new Error(
        "Usage record ID is required.",
      );
    }

    if (!props.organizationId) {
      throw new Error(
        "Usage organization ID is required.",
      );
    }

    if (
      ![
        "agent_execution",
        "mission_execution",
        "workflow_execution",
        "memory_entry",
        "storage",
        "api_request",
      ].includes(props.resource)
    ) {
      throw new Error(
        "Invalid usage resource.",
      );
    }

    if (
      ![
        "count",
        "bytes",
        "requests",
      ].includes(props.unit)
    ) {
      throw new Error(
        "Invalid usage unit.",
      );
    }

    if (
      !Number.isFinite(props.quantity) ||
      props.quantity <= 0
    ) {
      throw new Error(
        "Usage quantity must be greater than zero.",
      );
    }
  }
}
