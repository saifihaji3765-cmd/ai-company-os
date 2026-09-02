/**
 * Document Reader
 *
 * Responsible for normalizing document input into a stable
 * internal representation for the Company Builder pipeline.
 *
 * This layer intentionally does NOT perform AI interpretation.
 * Interpretation belongs to the analysis layer.
 */

export type AIDocumentSource =
  | "file"
  | "text"
  | "url"
  | "repository"
  | "unknown";

export interface AIDocumentInput {
  readonly id: string;
  readonly name: string;
  readonly content: string;
  readonly source: AIDocumentSource;
  readonly mimeType?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface AIReadDocument {
  readonly id: string;
  readonly name: string;
  readonly content: string;
  readonly source: AIDocumentSource;
  readonly mimeType?: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly characterCount: number;
  readonly lineCount: number;
  readonly readAt: string;
}

export interface AIDocumentReader {
  read(document: AIDocumentInput): Promise<AIReadDocument>;
}

export class BasicDocumentReader implements AIDocumentReader {
  public async read(
    document: AIDocumentInput,
  ): Promise<AIReadDocument> {
    if (!document.id.trim()) {
      throw new Error("Document id is required.");
    }

    if (!document.name.trim()) {
      throw new Error("Document name is required.");
    }

    if (typeof document.content !== "string") {
      throw new Error("Document content must be a string.");
    }

    const content = document.content.trim();

    if (!content) {
      throw new Error(
        `Document content is empty: ${document.id}`,
      );
    }

    const metadata = Object.freeze({
      ...(document.metadata ?? {}),
    });

    return Object.freeze({
      id: document.id,
      name: document.name,
      content,
      source: document.source,
      ...(document.mimeType
        ? { mimeType: document.mimeType }
        : {}),
      metadata,
      characterCount: content.length,
      lineCount: content.split(/\r?\n/).length,
      readAt: new Date().toISOString(),
    });
  }
}
