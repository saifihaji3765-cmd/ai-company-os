import type {
  DocumentContent,
  DocumentSection,
  DocumentRequirement,
} from "./document-intelligence.types";

/**
 * DocumentParser
 *
 * Converts raw document content into structured,
 * machine-readable company requirements.
 *
 * This layer is intentionally separated from the reader so that:
 * Reader  -> reads data
 * Parser  -> understands structure
 * Analyzer -> derives requirements
 * Builder -> converts requirements into implementation
 */

export interface ParsedDocument {
  readonly documentId: string;
  readonly title: string;
  readonly sections: readonly DocumentSection[];
  readonly requirements: readonly DocumentRequirement[];
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface DocumentParserOptions {
  readonly detectRequirements?: boolean;
  readonly preserveMetadata?: boolean;
}

export class DocumentParser {
  public parse(
    document: DocumentContent,
    options: DocumentParserOptions = {},
  ): ParsedDocument {
    const detectRequirements =
      options.detectRequirements ?? true;

    const preserveMetadata =
      options.preserveMetadata ?? true;

    const sections = this.extractSections(document);

    const requirements = detectRequirements
      ? this.extractRequirements(sections)
      : [];

    return {
      documentId: document.id,
      title: document.title,
      sections,
      requirements,
      metadata: preserveMetadata
        ? { ...document.metadata }
        : {},
    };
  }

  private extractSections(
    document: DocumentContent,
  ): DocumentSection[] {
    const lines = document.content.split(/\r?\n/);

    const sections: DocumentSection[] = [];

    let currentTitle = "General";
    let currentContent: string[] = [];

    const flushSection = (): void => {
      const content = currentContent.join("\n").trim();

      if (!content) {
        return;
      }

      sections.push({
        id: this.createSectionId(currentTitle, sections.length),
        title: currentTitle,
        content,
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
    sections: readonly DocumentSection[],
  ): DocumentRequirement[] {
    const requirements: DocumentRequirement[] = [];

    for (const section of sections) {
      const lines = section.content.split(/\r?\n/);

      for (const line of lines) {
        const text = line.trim();

        if (!text) {
          continue;
        }

        if (!this.looksLikeRequirement(text)) {
          continue;
        }

        requirements.push({
          id: `req-${requirements.length + 1}`,
          statement: this.cleanRequirement(text),
          sourceSectionId: section.id,
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

  private looksLikeRequirement(line: string): boolean {
    return (
      /^[-*]\s+/.test(line) ||
      /^\d+[.)]\s+/.test(line) ||
      /^(must|should|required|need|needs|shall|will)\b/i.test(line)
    );
  }

  private cleanRequirement(line: string): string {
    return line
      .replace(/^[-*]\s+/, "")
      .replace(/^\d+[.)]\s+/, "")
      .trim();
  }

  private createSectionId(
    title: string,
    index: number,
  ): string {
    const normalized = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `section-${index + 1}-${normalized || "general"}`;
  }
}
