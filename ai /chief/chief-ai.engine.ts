import type {
  ChiefAIDecision,
  ChiefAIRequest,
  ChiefAIConfig,
  ChiefAIState,
} from "./chief-ai.types";

export interface ChiefAIDecisionEngine {
  decide(
    request: ChiefAIRequest,
  ): Promise<ChiefAIDecision>;
}

export interface ChiefAICapabilityGateway {
  hasCapability(
    capabilityId: string,
  ): Promise<boolean>;

  canExecute(
    capabilityId: string,
  ): Promise<boolean>;
}

export interface ChiefAIApprovalGateway {
  requiresApproval(
    decision: ChiefAIDecision,
  ): Promise<boolean>;

  requestApproval(
    decision: ChiefAIDecision,
  ): Promise<boolean>;
}

export interface ChiefAIExecutionGateway {
  execute(
    decision: ChiefAIDecision,
  ): Promise<void>;
}

export interface ChiefAIRecoveryGateway {
  recover(
    requestId: string,
  ): Promise<void>;
}

export interface ChiefAIEngine {
  getState(): ChiefAIState;

  process(
    request: ChiefAIRequest,
  ): Promise<ChiefAIDecision>;
}

export class BasicChiefAIEngine
  implements ChiefAIEngine
{
  private state: ChiefAIState = {
    status: "ready",
    lastUpdatedAt: new Date().toISOString(),
  };

  public constructor(
    private readonly config: ChiefAIConfig,
    private readonly decisionEngine: ChiefAIDecisionEngine,
    private readonly capabilityGateway: ChiefAICapabilityGateway,
    private readonly approvalGateway: ChiefAIApprovalGateway,
    private readonly executionGateway: ChiefAIExecutionGateway,
    private readonly recoveryGateway: ChiefAIRecoveryGateway,
  ) {}

  public getState(): ChiefAIState {
    return this.state;
  }

  public async process(
    request: ChiefAIRequest,
  ): Promise<ChiefAIDecision> {
    this.ensureReady();

    this.state = {
      ...this.state,
      status: "thinking",
      activeRequestId: request.id,
      lastUpdatedAt: new Date().toISOString(),
    };

    try {
      const decision =
        await this.decisionEngine.decide(request);

      await this.verifyCapabilities(decision);

      const approvalRequired =
        await this.approvalGateway.requiresApproval(
          decision,
        );

      if (
        approvalRequired ||
        (
          this.config.requireApprovalForHighRisk &&
          request.priority === "critical"
        )
      ) {
        const approved =
          await this.approvalGateway.requestApproval(
            decision,
          );

        if (!approved) {
          const blockedDecision: ChiefAIDecision = {
            ...decision,
            requiresApproval: true,
            approved: false,
          };

          this.state = {
            ...this.state,
            status: "paused",
            activeDecisionId: decision.id,
            lastUpdatedAt:
              new Date().toISOString(),
          };

          return blockedDecision;
        }
      }

      if (!this.config.authority.canExecute) {
        throw new Error(
          "Chief AI does not have execution authority.",
        );
      }

      this.state = {
        ...this.state,
        status: "executing",
        activeDecisionId: decision.id,
        lastUpdatedAt: new Date().toISOString(),
      };

      await this.executionGateway.execute({
        ...decision,
        approved: true,
      });

      this.state = {
        ...this.state,
        status: "ready",
        activeRequestId: undefined,
        activeDecisionId: undefined,
        lastUpdatedAt: new Date().toISOString(),
      };

      return {
        ...decision,
        approved: true,
      };
    } catch (error) {
      this.state = {
        ...this.state,
        status: "emergency",
        lastUpdatedAt: new Date().toISOString(),
      };

      try {
        await this.recoveryGateway.recover(
          request.id,
        );
      } catch {
        // Recovery failure is intentionally contained.
      }

      throw error;
    }
  }

  private ensureReady(): void {
    if (
      this.state.status === "emergency" ||
      this.state.status === "shutdown"
    ) {
      throw new Error(
        `Chief AI cannot process requests while status is "${this.state.status}".`,
      );
    }

    if (
      this.config.maxConcurrentTasks < 1
    ) {
      throw new Error(
        "Chief AI maxConcurrentTasks must be at least 1.",
      );
    }
  }

  private async verifyCapabilities(
    decision: ChiefAIDecision,
  ): Promise<void> {
    if (
      !this.config.requireCapabilityRegistration
    ) {
      return;
    }

    for (
      const capabilityId
      of decision.requiredCapabilities
    ) {
      const registered =
        await this.capabilityGateway.hasCapability(
          capabilityId,
        );

      if (!registered) {
        throw new Error(
          `Required capability is not registered: ${capabilityId}`,
        );
      }

      const executable =
        await this.capabilityGateway.canExecute(
          capabilityId,
        );

      if (!executable) {
        throw new Error(
          `Required capability cannot execute: ${capabilityId}`,
        );
      }
    }
  }
}
