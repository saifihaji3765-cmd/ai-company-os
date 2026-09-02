import {
  AIRequirement,
  AIConstraint,
  AIContradiction,
  AIOwnerQuestion,
  AIDocumentAnalysis,
} from "../document-intelligence/document-intelligence.types";

import {
  CompanyBuilderIntelligenceContract,
  CompanyBuilderRequirement,
  CompanyBuilderConstraint,
  CompanyBuilderContradiction,
  CompanyBuilderOpenQuestion,
} from "../contracts/company-builder-intelligence.contract";

/* =========================================================
   CONSTANTS
   ========================================================= */

const CONTRACT_VERSION = "1.0.0";

/* =========================================================
   SERVICE
   ========================================================= */

/**
 * Converts Document Intelligence analysis into the
 * stable Company Builder Intelligence Contract.
 *
 * Responsibilities:
 * - Preserve source traceability
 * - Normalize intelligence data
 * - Generate stable Company Builder ids
 * - Calculate intelligence metadata
 * - Keep Document Intelligence isolated from
 *   downstream Company Builder modules
 */
export class CompanyBuilderIntelligenceService {
  /* =======================================================
     PUBLIC API
  ======================================================= */

  /**
   * Build a Company Builder intelligence contract from
   * Document Intelligence analysis.
   */
  public build(
    analysis: AIDocumentAnalysis
  ): CompanyBuilderIntelligenceContract {
    this.validateAnalysis(analysis);

    const requirements = this.mapRequirements(
      analysis.requirements
    );

    const constraints = this.mapConstraints(
      analysis.constraints,
      analysis.documentId
    );

    const contradictions = this.mapContradictions(
      analysis.contradictions
    );

    const openQuestions = this.mapOpenQuestions(
      analysis.ownerQuestions
    );

    const unresolvedRequirementCount =
      this.countUnresolvedRequirements(requirements);

    const blockingQuestionCount =
      this.countBlockingQuestions(openQuestions);

    const confidence = this.calculateConfidence(
      requirements,
      contradictions,
      openQuestions
    );

    return {
      contractVersion: CONTRACT_VERSION,

      document: {
        documentId: analysis.documentId,
        documentType: analysis.documentType,
        title: analysis.title,
      },

      requirements,

      constraints,

      contradictions,

      openQuestions,

      metadata: {
        generatedAt: new Date().toISOString(),

        sourceDocumentIds: [
          analysis.documentId,
        ],

        requirementCount:
          requirements.length,

        unresolvedRequirementCount,

        contradictionCount:
          contradictions.length,

        blockingQuestionCount,

        confidence,
      },
    };
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  private validateAnalysis(
    analysis: AIDocumentAnalysis
  ): void {
    if (!analysis) {
      throw new Error(
        "CompanyBuilderIntelligenceService: analysis is required."
      );
    }

    if (!analysis.documentId?.trim()) {
      throw new Error(
        "CompanyBuilderIntelligenceService: documentId is required."
      );
    }

    if (!analysis.documentType) {
      throw new Error(
        "CompanyBuilderIntelligenceService: documentType is required."
      );
    }

    if (!analysis.title?.trim()) {
      throw new Error(
        "CompanyBuilderIntelligenceService: document title is required."
      );
    }
  }

  /* =======================================================
     REQUIREMENTS
  ======================================================= */

  private mapRequirements(
    requirements: readonly AIRequirement[] = []
  ): readonly CompanyBuilderRequirement[] {
    const uniqueRequirements =
      new Map<string, CompanyBuilderRequirement>();

    for (const requirement of requirements) {
      if (!requirement?.id) {
        continue;
      }

      const id =
        `cbr-${requirement.id}`;

      uniqueRequirements.set(
        requirement.id,
        {
          id,

          statement:
            requirement.statement.trim(),

          priority:
            requirement.priority,

          status:
            requirement.status,

          dependencies:
            this.uniqueStrings(
              requirement.dependencies
            ),

          acceptanceCriteria:
            this.uniqueStrings(
              requirement.acceptanceCriteria
            ),

          sourceRequirementId:
            requirement.id,
        }
      );
    }

    return Array.from(
      uniqueRequirements.values()
    );
  }

  /* =======================================================
     CONSTRAINTS
  ======================================================= */

  private mapConstraints(
    constraints: readonly AIConstraint[] = [],
    sourceDocumentId: string
  ): readonly CompanyBuilderConstraint[] {
    const uniqueConstraints =
      new Map<string, CompanyBuilderConstraint>();

    for (const constraint of constraints) {
      if (!constraint?.id) {
        continue;
      }

      uniqueConstraints.set(
        constraint.id,
        {
          id:
            `cbc-${constraint.id}`,

          statement:
            constraint.statement.trim(),

          severity:
            constraint.severity,

          sourceDocumentId:
            constraint.sourceDocumentId ||
            sourceDocumentId,
        }
      );
    }

    return Array.from(
      uniqueConstraints.values()
    );
  }

  /* =======================================================
     CONTRADICTIONS
  ======================================================= */

  private mapContradictions(
    contradictions: readonly AIContradiction[] = []
  ): readonly CompanyBuilderContradiction[] {
    const uniqueContradictions =
      new Map<
        string,
        CompanyBuilderContradiction
      >();

    for (const contradiction of contradictions) {
      if (!contradiction?.id) {
        continue;
      }

      uniqueContradictions.set(
        contradiction.id,
        {
          id:
            `cbco-${contradiction.id}`,

          requirementIds:
            this.mapRequirementIds(
              contradiction.requirementIds
            ),

          description:
            contradiction.description.trim(),

          severity:
            contradiction.severity,

          resolved:
            contradiction.resolved,
        }
      );
    }

    return Array.from(
      uniqueContradictions.values()
    );
  }

  /* =======================================================
     OPEN QUESTIONS
  ======================================================= */

  private mapOpenQuestions(
    questions: readonly AIOwnerQuestion[] = []
  ): readonly CompanyBuilderOpenQuestion[] {
    const uniqueQuestions =
      new Map<
        string,
        CompanyBuilderOpenQuestion
      >();

    for (const question of questions) {
      if (!question?.id) {
        continue;
      }

      uniqueQuestions.set(
        question.id,
        {
          id:
            `cboq-${question.id}`,

          question:
            question.question.trim(),

          reason:
            question.reason.trim(),

          relatedRequirementIds:
            this.mapRequirementIds(
              question.relatedRequirementIds
            ),

          blocking:
            question.blocking,
        }
      );
    }

    return Array.from(
      uniqueQuestions.values()
    );
  }

  /* =======================================================
     REQUIREMENT ID MAPPING
  ======================================================= */

  private mapRequirementIds(
    ids: readonly string[] = []
  ): readonly string[] {
    return this.uniqueStrings(ids).map(
      (id) => `cbr-${id}`
    );
  }

  /* =======================================================
     UNRESOLVED REQUIREMENTS
  ======================================================= */

  private countUnresolvedRequirements(
    requirements: readonly CompanyBuilderRequirement[]
  ): number {
    return requirements.filter(
      (requirement) =>
        requirement.status !== "approved"
    ).length;
  }

  /* =======================================================
     BLOCKING QUESTIONS
  ======================================================= */

  private countBlockingQuestions(
    questions: readonly CompanyBuilderOpenQuestion[]
  ): number {
    return questions.filter(
      (question) =>
        question.blocking
    ).length;
  }

  /* =======================================================
     CONFIDENCE
  ======================================================= */

  private calculateConfidence(
    requirements: readonly CompanyBuilderRequirement[],
    contradictions: readonly CompanyBuilderContradiction[],
    questions: readonly CompanyBuilderOpenQuestion[]
  ): number {
    if (requirements.length === 0) {
      return 0;
    }

    const unresolvedRequirements =
      requirements.filter(
        (requirement) =>
          requirement.status !== "approved"
      ).length;

    const unresolvedContradictions =
      contradictions.filter(
        (contradiction) =>
          !contradiction.resolved
      ).length;

    const blockingQuestions =
      questions.filter(
        (question) =>
          question.blocking
      ).length;

    let confidence = 1;

    confidence -= Math.min(
      unresolvedRequirements /
        requirements.length *
        0.35,
      0.35
    );

    confidence -= Math.min(
      unresolvedContradictions *
        0.1,
      0.3
    );

    confidence -= Math.min(
      blockingQuestions *
        0.1,
      0.35
    );

    return Number(
      Math.max(
        0,
        Math.min(
          1,
          confidence
        )
      ).toFixed(2)
    );
  }

  /* =======================================================
     STRING NORMALIZATION
  ======================================================= */

  private uniqueStrings(
    values: readonly string[] = []
  ): readonly string[] {
    const normalized =
      values
        .filter(
          (value) =>
            typeof value === "string"
        )
        .map(
          (value) =>
            value.trim()
        )
        .filter(
          (value) =>
            value.length > 0
        );

    return Array.from(
      new Set(normalized)
    );
  }
}

/* =========================================================
   DEFAULT SERVICE INSTANCE
   ========================================================= */

export const companyBuilderIntelligenceService =
  new CompanyBuilderIntelligenceService();
