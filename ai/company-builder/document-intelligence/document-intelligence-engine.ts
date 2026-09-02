import {
  DocumentParser,
  type DocumentParserInput,
} from "./document-parser";

import {
  DocumentAnalyzer,
  type DocumentAnalyzerInput,
} from "./document-analyzer";

import type {
  AIDocumentAnalysis,
} from "./document-intelligence.types";

/**
 * Document Intelligence Engine
 *
 * Orchestrates the complete document-understanding pipeline:
 *
 * Raw document
 *      ↓
 * Document Parser
 *      ↓
 * Structured sections + requirements
 *      ↓
 * Document Analyzer
 *      ↓
 * Enterprise document intelligence
 */
export interface DocumentIntelligenceInput {
  readonly documentId: string;
  readonly documentType: AIDocumentAnalysis["documentType"];
  readonly title: string;
  readonly content: string;
}

export interface DocumentIntelligenceResult {
  readonly analysis: AIDocumentAnalysis;
  readonly pipeline: readonly string[];
}

export class DocumentIntelligenceEngine {
  private readonly parser: DocumentParser;
  private readonly analyzer: DocumentAnalyzer;

  public constructor(
    parser: DocumentParser = new DocumentParser(),
    analyzer: DocumentAnalyzer = new DocumentAnalyzer(),
  ) {
    this.parser = parser;
    this.analyzer = analyzer;
  }

  public process(
    input: DocumentIntelligenceInput,
  ): DocumentIntelligenceResult {
    const parsed = this.parser.parse(
      this.toParserInput(input),
    );

    const analysis = this.analyzer.analyze(
      this.toAnalyzerInput(input, parsed),
    );

    return {
      analysis,
      pipeline: [
        "document-input",
        "document-parser",
        "requirement-extraction",
        "document-analyzer",
        "constraint-detection",
        "contradiction-detection",
        "unanswered-question-detection",
        "document-analysis",
      ],
    };
  }

  private toParserInput(
    input: DocumentIntelligenceInput,
  ): DocumentParserInput {
    return {
      documentId: input.documentId,
      title: input.title,
      content: input.content,
    };
  }

  private toAnalyzerInput(
    input: DocumentIntelligenceInput,
    parsed: ReturnType<DocumentParser["parse"]>,
  ): DocumentAnalyzerInput {
    return {
      documentId: input.documentId,
      documentType: input.documentType,
      title: input.title,
      sections: parsed.sections,
      requirements: parsed.requirements,
    };
  }
}
