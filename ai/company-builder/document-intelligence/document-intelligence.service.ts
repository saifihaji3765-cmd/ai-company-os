import {
  AIDocumentAnalysis,
} from "./document-intelligence.types";

import { DocumentReader } from "./document-reader";
import { DocumentParser } from "./document-parser";
import { DocumentAnalyzer } from "./document-analyzer";
import {
  RequirementNormalizer,
} from "./requirement-normalizer";

/* =========================================================
   TYPES
   ========================================================= */

export interface DocumentIntelligenceInput {
  readonly documentId: string;
  readonly source: string;
}

export interface DocumentIntelligenceResult {
  readonly analysis: AIDocumentAnalysis;
}

/* =========================================================
   SERVICE
   ========================================================= */

export class DocumentIntelligenceService {
  private readonly reader: DocumentReader;
  private readonly parser: DocumentParser;
  private readonly analyzer: DocumentAnalyzer;
  private readonly normalizer: RequirementNormalizer;

  constructor(
    reader: DocumentReader,
    parser: DocumentParser,
    analyzer: DocumentAnalyzer,
    normalizer: RequirementNormalizer
  ) {
    this.reader = reader;
    this.parser = parser;
    this.analyzer = analyzer;
    this.normalizer = normalizer;
  }

  /* =======================================================
     MAIN PIPELINE
     ======================================================= */

  public async analyze(
    input: DocumentIntelligenceInput
  ): Promise<DocumentIntelligenceResult> {
    if (!input.documentId?.trim()) {
      throw new Error(
        "Document Intelligence: documentId is required."
      );
    }

    if (!input.source?.trim()) {
      throw new Error(
        "Document Intelligence: document source is required."
      );
    }

    /* -----------------------------------------------------
       1. READ
       ----------------------------------------------------- */

    const document = await this.reader.read(
      input.source
    );

    /* -----------------------------------------------------
       2. PARSE
       ----------------------------------------------------- */

    const parsed = await this.parser.parse(
      document
    );

    /* -----------------------------------------------------
       3. ANALYZE
       ----------------------------------------------------- */

    const analysis =
      await this.analyzer.analyze(parsed);

    /* -----------------------------------------------------
       4. NORMALIZE REQUIREMENTS
       ----------------------------------------------------- */

    const normalized =
      this.normalizer.normalize({
        requirements: analysis.requirements,
      });

    /* -----------------------------------------------------
       5. FINAL RESULT
       ----------------------------------------------------- */

    const finalAnalysis: AIDocumentAnalysis = {
      ...analysis,

      documentId: input.documentId,

      requirements: normalized.requirements,

      analyzedAt:
        analysis.analyzedAt ??
        new Date().toISOString(),
    };

    return {
      analysis: finalAnalysis,
    };
  }
}

/* =========================================================
   FACTORY
   ========================================================= */

export function createDocumentIntelligenceService(
  reader: DocumentReader,
  parser: DocumentParser,
  analyzer: DocumentAnalyzer,
  normalizer: RequirementNormalizer
): DocumentIntelligenceService {
  return new DocumentIntelligenceService(
    reader,
    parser,
    analyzer,
    normalizer
  );
}
