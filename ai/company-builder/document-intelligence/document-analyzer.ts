import type {
  AIDocumentAnalysis,
  AIDocumentSection,
  AIRequirement,
  AIConstraint,
  AIContradiction,
  AIUnansweredQuestion,
} from "./document-intelligence.types";

export interface DocumentAnalyzerInput {
  readonly documentId: string;
  readonly documentType: AIDocumentAnalysis["documentType"];
  readonly title: string;
  readonly sections: readonly AIDocumentSection[];
  readonly requirements: readonly AIRequirement[];
}

export class DocumentAnalyzer {
  public analyze(
    input: DocumentAnalyzerInput,
  ): AIDocumentAnalysis {
    const constraints = this.detectConstraints(
      input.sections,
    );

    const contradictions = this.detectContradictions(
      input.requirements,
    );

    const unansweredQuestions =
      this.detectUnansweredQuestions(
        input.requirements,
      );

    return {
      documentId: input.documentId,
      documentType: input.documentType,
      title: input.title,
      summary: this.buildSummary(
        input.sections,
        input.requirements,
      ),
      sections: input.sections,
      requirements: input.requirements,
      constraints,
      contradictions,
      unansweredQuestions,
      analyzedAt: new Date().toISOString(),
    };
  }

  private detectConstraints(
    sections: readonly AIDocumentSection[],
  ): AIConstraint[] {
    const constraints: AIConstraint[] = [];

    for (const section of sections) {
      const lines = section.content.split(/\r?\n/);

      for (const line of lines) {
        const statement = line.trim();

        if (!statement) {
          continue;
        }

        if (!this.looksLikeConstraint(statement)) {
          continue;
        }

        constraints.push({
          id: `constraint-${constraints.length + 1}`,
          statement: this.cleanStatement(statement),
          sourceDocumentId: section.id,
          severity: "medium",
        });
      }
    }

    return constraints;
  }

  private detectContradictions(
    requirements: readonly AIRequirement[],
  ): AIContradiction[] {
    const contradictions: AIContradiction[] = [];

    for (let i = 0; i < requirements.length; i += 1) {
      for (
        let j = i + 1;
        j < requirements.length;
        j += 1
      ) {
        const first = requirements[i];
        const second = requirements[j];

        if (
          this.mayConflict(
            first.statement,
            second.statement,
          )
        ) {
          contradictions.push({
            id: `contradiction-${contradictions.length + 1}`,
            requirementIds: [
              first.id,
              second.id,
            ],
            description:
              `Potential conflict between requirements: "${first.statement}" and "${second.statement}".`,
            severity: "high",
            resolved: false,
          });
        }
      }
    }

    return contradictions;
  }

  private detectUnansweredQuestions(
    requirements: readonly AIRequirement[],
  ): AIUnansweredQuestion[] {
    const questions: AIUnansweredQuestion[] = [];

    for (const requirement of requirements) {
      if (
        this.isAmbiguousRequirement(
          requirement.statement,
        )
      ) {
        questions.push({
          id: `question-${questions.length + 1}`,
          question:
            `Please clarify the requirement: "${requirement.statement}"`,
          reason:
            "The requirement does not contain enough information for reliable implementation.",
          relatedRequirementIds: [requirement.id],
          blocking: true,
        });
      }
    }

    return questions;
  }

  private buildSummary(
    sections: readonly AIDocumentSection[],
    requirements: readonly AIRequirement[],
  ): string {
    return [
      `Document contains ${sections.length} sections.`,
      `Detected ${requirements.length} requirements.`,
    ].join(" ");
  }

  private looksLikeConstraint(
    statement: string,
  ): boolean {
    return /^(must|cannot|can't|only|never|always|restricted|limited|forbidden|required)\b/i.test(
      statement,
    );
  }

  private mayConflict(
    first: string,
    second: string,
  ): boolean {
    const a = first.toLowerCase();
    const b = second.toLowerCase();

    const oppositePairs: readonly [
      string,
      string,
    ][] = [
      ["must", "must not"],
      ["always", "never"],
      ["required", "forbidden"],
      ["only", "cannot"],
    ];

    return oppositePairs.some(
      ([left, right]) =>
        (a.includes(left) && b.includes(right)) ||
        (a.includes(right) && b.includes(left)),
    );
  }

  private isAmbiguousRequirement(
    statement: string,
  ): boolean {
    return (
      statement.length < 15 ||
      /\b(something|etc|and so on|as needed|appropriate)\b/i.test(
        statement,
      )
    );
  }

  private cleanStatement(
    statement: string,
  ): string {
    return statement
      .replace(/^[-*]\s+/, "")
      .replace(/^\d+[.)]\s+/, "")
      .trim();
  }
}
