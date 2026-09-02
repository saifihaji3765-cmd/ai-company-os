import {
  AIRequirement,
  AIRequirementPriority,
  AIRequirementStatus,
  AIDocumentType,
} from "../document-intelligence/document-intelligence.types";

/* =========================================================
   COMPANY BUILDER INTELLIGENCE CONTRACT
   ========================================================= */

/**
 * Stable boundary between Document Intelligence
 * and the Company Builder pipeline.
 *
 * Document Intelligence produces this contract.
 * Downstream Company Builder modules consume it.
 */
export interface CompanyBuilderIntelligenceContract {
  readonly contractVersion: string;

  readonly document: {
    readonly documentId: string;
    readonly documentType: AIDocumentType;
    readonly title: string;
  };

  readonly requirements: readonly CompanyBuilderRequirement[];

  readonly constraints: readonly CompanyBuilderConstraint[];

  readonly contradictions: readonly CompanyBuilderContradiction[];

  readonly openQuestions: readonly CompanyBuilderOpenQuestion[];

  readonly metadata: CompanyBuilderIntelligenceMetadata;
}

/* =========================================================
   REQUIREMENT
   ========================================================= */

export interface CompanyBuilderRequirement {
  readonly id: string;

  readonly statement: string;

  readonly priority: AIRequirementPriority;

  readonly status: AIRequirementStatus;

  readonly dependencies: readonly string[];

  readonly acceptanceCriteria: readonly string[];

  /**
   * Original requirement id from Document Intelligence.
   * Allows complete source → implementation traceability.
   */
  readonly sourceRequirementId: string;
}

/* =========================================================
   CONSTRAINT
   ========================================================= */

export interface CompanyBuilderConstraint {
  readonly id: string;

  readonly statement: string;

  readonly severity: AIRequirementPriority;

  readonly sourceDocumentId: string;
}

/* =========================================================
   CONTRADICTION
   ========================================================= */

export interface CompanyBuilderContradiction {
  readonly id: string;

  readonly requirementIds: readonly string[];

  readonly description: string;

  readonly severity: AIRequirementPriority;

  readonly resolved: boolean;
}

/* =========================================================
   OPEN QUESTION
   ========================================================= */

export interface CompanyBuilderOpenQuestion {
  readonly id: string;

  readonly question: string;

  readonly reason: string;

  readonly relatedRequirementIds: readonly string[];

  readonly blocking: boolean;
}

/* =========================================================
   METADATA
   ========================================================= */

export interface CompanyBuilderIntelligenceMetadata {
  readonly generatedAt: string;

  readonly sourceDocumentIds: readonly string[];

  readonly requirementCount: number;

  readonly unresolvedRequirementCount: number;

  readonly contradictionCount: number;

  readonly blockingQuestionCount: number;

  readonly confidence?: number;
}

/* =========================================================
   TYPE GUARDS
   ========================================================= */

export function isBlockingIntelligenceContract(
  contract: CompanyBuilderIntelligenceContract
): boolean {
  return contract.openQuestions.some(
    (question) => question.blocking
  );
}

/* =========================================================
   READINESS
   ========================================================= */

export interface CompanyBuilderIntelligenceReadiness {
  readonly readyForArchitecture: boolean;

  readonly blockingIssues: readonly string[];

  readonly warnings: readonly string[];
}

/**
 * Determines whether the intelligence output is
 * sufficiently resolved for architecture planning.
 */
export function evaluateIntelligenceReadiness(
  contract: CompanyBuilderIntelligenceContract
): CompanyBuilderIntelligenceReadiness {
  const blockingIssues: string[] = [];
  const warnings: string[] = [];

  for (const question of contract.openQuestions) {
    if (question.blocking) {
      blockingIssues.push(
        `Blocking question: ${question.question}`
      );
    } else {
      warnings.push(
        `Open question: ${question.question}`
      );
    }
  }

  for (const contradiction of contract.contradictions) {
    if (!contradiction.resolved) {
      blockingIssues.push(
        `Unresolved contradiction: ${contradiction.id}`
      );
    }
  }

  for (const requirement of contract.requirements) {
    if (requirement.status === "ambiguous") {
      warnings.push(
        `Ambiguous requirement: ${requirement.id}`
      );
    }
  }

  return {
    readyForArchitecture:
      blockingIssues.length === 0,

    blockingIssues,

    warnings,
  };
}
