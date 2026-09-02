import {
  AIRequirement,
  AIRequirementPriority,
  AIRequirementStatus,
} from "./document-intelligence.types";

/* =========================================================
   TYPES
   ========================================================= */

export interface NormalizationInput {
  readonly requirements: readonly AIRequirement[];
}

export interface NormalizationResult {
  readonly requirements: readonly AIRequirement[];
  readonly duplicates: readonly string[][];
  readonly normalizedCount: number;
}

/* =========================================================
   NORMALIZER
   ========================================================= */

export class RequirementNormalizer {
  /**
   * Normalize requirements into a deterministic structure
   * suitable for architecture planning and code generation.
   */
  public normalize(
    input: NormalizationInput
  ): NormalizationResult {
    const source = input.requirements ?? [];

    const normalized: AIRequirement[] = [];
    const duplicateGroups: string[][] = [];
    const seen = new Map<string, AIRequirement>();
    const groups = new Map<string, string[]>();

    for (const requirement of source) {
      const normalizedRequirement = this.normalizeRequirement(
        requirement
      );

      const fingerprint = this.createFingerprint(
        normalizedRequirement
      );

      const existing = seen.get(fingerprint);

      if (existing) {
        const group = groups.get(fingerprint) ?? [
          existing.id,
        ];

        group.push(normalizedRequirement.id);
        groups.set(fingerprint, group);

        continue;
      }

      seen.set(fingerprint, normalizedRequirement);
      normalized.push(normalizedRequirement);
    }

    for (const group of groups.values()) {
      if (group.length > 1) {
        duplicateGroups.push([...group]);
      }
    }

    return {
      requirements: normalized,
      duplicates: duplicateGroups,
      normalizedCount: normalized.length,
    };
  }

  /* =======================================================
     REQUIREMENT NORMALIZATION
     ======================================================= */

  private normalizeRequirement(
    requirement: AIRequirement
  ): AIRequirement {
    return {
      ...requirement,

      statement: this.normalizeText(
        requirement.statement
      ),

      priority: this.normalizePriority(
        requirement.priority
      ),

      status: this.normalizeStatus(
        requirement.status
      ),

      dependencies: this.uniqueStrings(
        requirement.dependencies
      ),

      acceptanceCriteria: this.uniqueStrings(
        requirement.acceptanceCriteria
      ),
    };
  }

  /* =======================================================
     TEXT NORMALIZATION
     ======================================================= */

  private normalizeText(value: string): string {
    return value
      .replace(/\s+/g, " ")
      .trim();
  }

  /* =======================================================
     PRIORITY NORMALIZATION
     ======================================================= */

  private normalizePriority(
    priority: AIRequirementPriority
  ): AIRequirementPriority {
    switch (priority) {
      case "low":
      case "medium":
      case "high":
      case "critical":
        return priority;

      default:
        return "medium";
    }
  }

  /* =======================================================
     STATUS NORMALIZATION
     ======================================================= */

  private normalizeStatus(
    status: AIRequirementStatus
  ): AIRequirementStatus {
    switch (status) {
      case "identified":
      case "understood":
      case "ambiguous":
      case "conflicting":
      case "approved":
        return status;

      default:
        return "identified";
    }
  }

  /* =======================================================
     UNIQUE VALUES
     ======================================================= */

  private uniqueStrings(
    values: readonly string[] = []
  ): string[] {
    const result: string[] = [];
    const seen = new Set<string>();

    for (const value of values) {
      const normalized = this.normalizeText(value);

      if (!normalized) {
        continue;
      }

      const key = normalized.toLowerCase();

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      result.push(normalized);
    }

    return result;
  }

  /* =======================================================
     FINGERPRINT
     ======================================================= */

  private createFingerprint(
    requirement: AIRequirement
  ): string {
    const statement = requirement.statement
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

    return [
      statement,
      requirement.priority,
      [...requirement.dependencies]
        .map((value) => value.toLowerCase())
        .sort()
        .join(","),
      [...requirement.acceptanceCriteria]
        .map((value) => value.toLowerCase())
        .sort()
        .join(","),
    ].join("|");
  }
}

/* =========================================================
   DEFAULT INSTANCE
   ========================================================= */

export const requirementNormalizer =
  new RequirementNormalizer();
