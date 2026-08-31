import type {
  AIKnowledgeCategory,
  AIKnowledgeItem,
} from "./knowledge.types";

export class AIKnowledgeStore {
  private readonly items = new Map<string, AIKnowledgeItem>();

  public save(item: AIKnowledgeItem): void {
    this.items.set(item.id, item);
  }

  public get(id: string): AIKnowledgeItem | undefined {
    return this.items.get(id);
  }

  public findByCategory(
    category: AIKnowledgeCategory,
  ): readonly AIKnowledgeItem[] {
    return Array.from(this.items.values()).filter(
      (item) => item.category === category,
    );
  }

  public search(query: string): readonly AIKnowledgeItem[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return [];
    }

    return Array.from(this.items.values()).filter((item) =>
      `${item.title} ${item.content}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }

  public delete(id: string): boolean {
    return this.items.delete(id);
  }

  public list(): readonly AIKnowledgeItem[] {
    return Array.from(this.items.values());
  }
}
