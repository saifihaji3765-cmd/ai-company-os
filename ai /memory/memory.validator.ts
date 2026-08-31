import type { AIMemory } from "./memory.types";

export interface AIMemoryValidationResult {
  readonly valid: boolean;
  readonly issues: readonly string[];
}

export interface AIMemoryValidator {
  validate(
    memory: AIMemory,
  ): Promise<AIMemoryValidationResult>;
}

export class BasicMemoryValidator
  implements AIMemoryValidator
{
  public async validate(
    memory: AIMemory,
  ): Promise<AIMemoryValidationResult> {
    const issues: string[] = [];

    if (!memory.id.trim()) {
      issues.push("Memory ID is required.");
    }

    if (!memory.content.trim()) {
      issues.push("Memory content is required.");
    }

    if (
      memory.relevance < 0 ||
      memory.relevance > 1
    ) {
      issues.push(
        "Memory relevance must be between 0 and 1.",
      );
    }

    if (memory.version < 1) {
      issues.push(
        "Memory version must be at least 1.",
      );
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}
