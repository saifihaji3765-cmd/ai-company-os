import type {
  ChiefAIAuthority,
  ChiefAIConfig,
} from "./chief-ai.types";

export const DEFAULT_CHIEF_AI_AUTHORITY: ChiefAIAuthority = {
  canAnalyze: true,
  canPlan: true,
  canDecide: true,
  canExecute: true,
  canRequestApproval: true,
  canTriggerRecovery: true,
  canEnterEmergencyMode: true,
};

export const DEFAULT_CHIEF_AI_CONFIG: ChiefAIConfig = {
  id: "chief-ai",
  name: "Chief AI",
  version: "1.0.0",
  authority: DEFAULT_CHIEF_AI_AUTHORITY,
  maxConcurrentTasks: 1,
  requireApprovalForHighRisk: true,
  requireCapabilityRegistration: true,
};

export interface ChiefAIConfigValidator {
  validate(
    config: ChiefAIConfig,
  ): readonly string[];
}

export class BasicChiefAIConfigValidator
  implements ChiefAIConfigValidator
{
  public validate(
    config: ChiefAIConfig,
  ): readonly string[] {
    const issues: string[] = [];

    if (!config.id.trim()) {
      issues.push("Chief AI id is required.");
    }

    if (!config.name.trim()) {
      issues.push("Chief AI name is required.");
    }

    if (!config.version.trim()) {
      issues.push("Chief AI version is required.");
    }

    if (config.maxConcurrentTasks < 1) {
      issues.push(
        "maxConcurrentTasks must be at least 1.",
      );
    }

    if (
      config.requireApprovalForHighRisk &&
      !config.authority.canRequestApproval
    ) {
      issues.push(
        "High-risk approval is enabled but approval authority is disabled.",
      );
    }

    if (
      config.authority.canExecute &&
      !config.requireCapabilityRegistration
    ) {
      issues.push(
        "Execution authority requires registered capability enforcement.",
      );
    }

    return issues;
  }
}
