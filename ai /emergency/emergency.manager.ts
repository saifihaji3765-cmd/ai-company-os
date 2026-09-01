import type {
  AIEmergencyEvent,
  AIEmergencySeverity,
  AIEmergencyStatus,
} from "./emergency.types";

export interface AIEmergencyManager {
  activate(input: {
    readonly severity: AIEmergencySeverity;
    readonly source: string;
    readonly reason: string;
  }): Promise<AIEmergencyEvent>;

  updateStatus(
    id: string,
    status: AIEmergencyStatus,
  ): Promise<AIEmergencyEvent>;

  get(
    id: string,
  ): Promise<AIEmergencyEvent | undefined>;

  getActive(): Promise<
    readonly AIEmergencyEvent[]
  >;
}

export class BasicEmergencyManager
  implements AIEmergencyManager
{
  private readonly events =
    new Map<string, AIEmergencyEvent>();

  public async activate(input: {
    readonly severity: AIEmergencySeverity;
    readonly source: string;
    readonly reason: string;
  }): Promise<AIEmergencyEvent> {
    const now = new Date().toISOString();

    const event: AIEmergencyEvent = {
      id: `emergency-${Date.now()}`,
      severity: input.severity,
      status: "active",
      source: input.source,
      reason: input.reason,
      detectedAt: now,
      activatedAt: now,
    };

    this.events.set(event.id, event);

    return event;
  }

  public async updateStatus(
    id: string,
    status: AIEmergencyStatus,
  ): Promise<AIEmergencyEvent> {
    const event = this.events.get(id);

    if (!event) {
      throw new Error(
        `Emergency event not found: ${id}`,
      );
    }

    const updated: AIEmergencyEvent = {
      ...event,
      status,
      resolvedAt:
        status === "resolved"
          ? new Date().toISOString()
          : event.resolvedAt,
    };

    this.events.set(id, updated);

    return updated;
  }

  public async get(
    id: string,
  ): Promise<AIEmergencyEvent | undefined> {
    return this.events.get(id);
  }

  public async getActive(): Promise<
    readonly AIEmergencyEvent[]
  > {
    return Array.from(this.events.values()).filter(
      (event) =>
        event.status === "detected" ||
        event.status === "active" ||
        event.status === "contained",
    );
  }
}
