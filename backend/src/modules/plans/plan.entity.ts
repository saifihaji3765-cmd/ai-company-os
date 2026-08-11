import type {
  Brand,
  ISODateString,
} from "../../core";

export type PlanId = Brand<
  string,
  "PlanId"
>;

export type PlanKey = Brand<
  string,
  "PlanKey"
>;

export type PlanStatus =
  | "active"
  | "disabled"
  | "archived";

export type PlanScope =
  | "platform"
  | "organization"
  | "workspace"
  | "project";

export interface PlanLimits {
  readonly maxProjects: number | null;
  readonly maxAgents: number | null;
  readonly maxConcurrentAgents: number | null;
  readonly maxMissions: number | null;
  readonly maxConcurrentMissions: number | null;
  readonly maxWorkflows: number | null;
  readonly maxMemoryEntries: number | null;
  readonly maxStorageBytes: number | null;
}

export interface PlanCapabilities {
  readonly aiExecution: boolean;
  readonly agentExecution: boolean;
  readonly workflowExecution: boolean;
  readonly memory: boolean;
  readonly integrations: boolean;
  readonly automation: boolean;
}

export interface PlanEntityProps {
  readonly id: PlanId;
  readonly key: PlanKey;
  readonly name: string;
  readonly description: string;
  readonly scope: PlanScope;
  readonly status: PlanStatus;
  readonly capabilities: PlanCapabilities;
  readonly limits: PlanLimits;
  readonly systemManaged: boolean;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export class PlanEntity {
  private readonly props: PlanEntityProps;

  private constructor(
    props: PlanEntityProps,
  ) {
    this.props = Object.freeze({
      ...props,
      capabilities: Object.freeze({
        ...props.capabilities,
      }),
      limits: Object.freeze({
        ...props.limits,
      }),
    });
  }

  static create(
    props: PlanEntityProps,
  ): PlanEntity {
    PlanEntity.validate(props);

    return new PlanEntity(props);
  }

  get id(): PlanId {
    return this.props.id;
  }

  get key(): PlanKey {
    return this.props.key;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get scope(): PlanScope {
    return this.props.scope;
  }

  get status(): PlanStatus {
    return this.props.status;
  }

  get capabilities(): PlanCapabilities {
    return this.props.capabilities;
  }

  get limits(): PlanLimits {
    return this.props.limits;
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

  hasCapability(
    capability: keyof PlanCapabilities,
  ): boolean {
    return this.props.capabilities[capability];
  }

  toObject(): PlanEntityProps {
    return {
      ...this.props,
      capabilities: {
        ...this.props.capabilities,
      },
      limits: {
        ...this.props.limits,
      },
    };
  }

  private static validate(
    props: PlanEntityProps,
  ): void {
    if (!props.id) {
      throw new Error(
        "Plan ID is required.",
      );
    }

    if (!props.key) {
      throw new Error(
        "Plan key is required.",
      );
    }

    if (!props.name.trim()) {
      throw new Error(
        "Plan name is required.",
      );
    }

    if (!props.description.trim()) {
      throw new Error(
        "Plan description is required.",
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
        "Invalid plan scope.",
      );
    }

    if (
      ![
        "active",
        "disabled",
        "archived",
      ].includes(props.status)
    ) {
      throw new Error(
        "Invalid plan status.",
      );
    }

    PlanEntity.validateCapabilities(
      props.capabilities,
    );

    PlanEntity.validateLimits(
      props.limits,
    );
  }

  private static validateCapabilities(
    capabilities: PlanCapabilities,
  ): void {
    const values = Object.values(capabilities);

    if (
      values.some(
        (value) => typeof value !== "boolean",
      )
    ) {
      throw new Error(
        "Plan capabilities must be boolean values.",
      );
    }
  }

  private static validateLimits(
    limits: PlanLimits,
  ): void {
    const values = Object.values(limits);

    for (const value of values) {
      if (
        value !== null &&
        (!Number.isInteger(value) ||
          value < 0)
      ) {
        throw new Error(
          "Plan limits must be non-negative integers or null.",
        );
      }
    }
  }
}
