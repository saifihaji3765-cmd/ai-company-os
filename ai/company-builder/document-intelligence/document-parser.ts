import type {
  AIDocumentSection,
  AIRequirement,
} from "./document-intelligence.types";

export interface DocumentParserInput {
  readonly documentId: string;
  readonly title: string;
  readonly content: string;
}

export interface ParsedDocument {
  readonly documentId: string;
  readonly title: string;
  readonly sections: readonly AIDocumentSection[];
  readonly requirements: readonly AIRequirement[];
}

export class DocumentParser {
  public parse(input: DocumentParserInput): ParsedDocument {
    const sections = this.extractSections(input.content);

    const requirements = this.extractRequirements(sections);

    return {
      documentId: input.documentId,
      title: input.title,
      sections,
      requirements,
    };
  }

  private extractSections(
    content: string,
  ): AIDocumentSection[] {
    const lines = content.split(/\r?\n/);

    const sections: AIDocumentSection[] = [];

    let currentTitle = "General";
    let currentContent: string[] = [];

    const flushSection = (): void => {
      const sectionContent =
        currentContent.join("\n").trim();

      if (!sectionContent) {
        return;
      }

      sections.push({
        id: `section-${sections.length + 1}`,
        title: currentTitle,
        content: sectionContent,
        order: sections.length,
      });

      currentContent = [];
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (this.isHeading(line)) {
        flushSection();
        currentTitle = this.cleanHeading(line);
        continue;
      }

      currentContent.push(rawLine);
    }

    flushSection();

    return sections;
  }

  private extractRequirements(
    sections: readonly AIDocumentSection[],
  ): AIRequirement[] {
    const requirements: AIRequirement[] = [];

    for (const section of sections) {
      const lines = section.content.split(/\r?\n/);

      for (const line of lines) {
        const statement = this.cleanRequirement(line);

        if (!statement) {
          continue;
        }

        if (!this.looksLikeRequirement(statement)) {
          continue;
        }

        requirements.push({
          id: `requirement-${requirements.length + 1}`,
          statement,
          priority: "medium",
          status: "identified",
          sourceSectionId: section.id,
          dependencies: [],
          acceptanceCriteria: [],
        });
      }
    }

    return requirements;
  }

  private isHeading(line: string): boolean {
    return (
      /^#{1,6}\s+/.test(line) ||
      /^[A-Z][A-Z0-9\s_-]{3,}$/.test(line)
    );
  }

  private cleanHeading(line: string): string {
    return line
      .replace(/^#{1,6}\s+/, "")
      .trim();
  }

  private cleanRequirement(line: string): string {
    return line
      .replace(/^[-*]\s+/, "")
      .replace(/^\d+[.)]\s+/, "")
      .trim();
  }

  private looksLikeRequirement(line: string): boolean {
    return (
      /^[-*]\s+/.test(line) ||
      /^\d+[.)]\s+/.test(line) ||
      /^(must|should|required|need|needs|shall|will)\b/i.test(
        line,
      )
    );
  }
}
