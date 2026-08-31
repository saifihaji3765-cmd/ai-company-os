import type {
  AIMission,
  AIMissionPriority,
  AIMissionStatus,
} from "./mission.types";

export class AIMissionManager {
  private readonly missions = new Map<string, AIMission>();

  public createMission(input: {
    readonly objective: string;
    readonly priority: AIMissionPriority;
    readonly successCriteria: readonly string[];
    readonly riskLevel: string;
  }): AIMission {
    const now = new Date().toISOString();

    const mission: AIMission = {
      id: `mission-${Date.now()}`,
      priority: input.priority,
      objective: input.objective,
      successCriteria: input.successCriteria,
      riskLevel: input.riskLevel,
      status: "pending",
      executionHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    this.missions.set(mission.id, mission);

    return mission;
  }

  public getMission(id: string): AIMission | undefined {
    return this.missions.get(id);
  }

  public updateStatus(
    id: string,
    status: AIMissionStatus,
  ): AIMission {
    const mission = this.missions.get(id);

    if (!mission) {
      throw new Error(`Mission not found: ${id}`);
    }

    const updatedMission: AIMission = {
      ...mission,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.missions.set(id, updatedMission);

    return updatedMission;
  }

  public listMissions(): readonly AIMission[] {
    return Array.from(this.missions.values());
  }
}
