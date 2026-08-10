import type {
  ISODateString,
  Brand,
} from "../../core";

export type OrganizationId = Brand<
  string,
  "OrganizationId"
>;

export type OrganizationStatus =
  | "active"
  | "suspended"
  | "deactivated";

export interface OrganizationEntityProps {
  readonly id: OrganizationId;
  readonly name: string;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export class OrganizationEntity {
  private readonly props: OrganizationEntityProps;

  private constructor(
    props: OrganizationEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
    });
  }

  static create(
    props: OrganizationEntityProps,
  ): OrganizationEntity {
    OrganizationEntity.validate(props);

    return new OrganizationEntity(props);
  }

  get id(): OrganizationId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get status(): OrganizationStatus {
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

  toObject(): OrganizationEntityProps {
    return {
      ...this.props,
    };
  }

  private static validate(
    props: OrganizationEntityProps,
  ): void {
    if (!props.id) {
      throw new Error(
        "Organization ID is required.",
      );
    }

    if (!props.name.trim()) {
      throw new Error(
        "Organization name is required.",
      );
    }

    if (!props.slug.trim()) {
      throw new Error(
        "Organization slug is required.",
      );
    }

    if (
      ![
        "active",
        "suspended",
        "deactivated",
      ].includes(props.status)
    ) {
      throw new Error(
        "Invalid organization status.",
      );
    }
  }
}
