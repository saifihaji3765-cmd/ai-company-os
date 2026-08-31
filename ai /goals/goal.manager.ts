import type {
  AIGoal,
  AIGoalPriority,
  AIGoalStatus,
} from "./goal.types";

export class AIGoalManager {
  private readonly goals = new Map<string, AIGoal>();

  public createGoal(input: {
    readonly objective: string;
    readonly priority: AIGoalPriority;
    readonly deadline?: string;
    readonly businessValue: string;
    readonly successCriteria: readonly string[];
  }): AIGoal {
    const now = new Date().toISOString();

    const goal: AIGoal = {
      id: `goal-${Date.now()}`,
      objective: input.objective,
      priority: input.priority,
      deadline: input.deadline,
      businessValue: input.businessValue,
      successCriteria: input.successCriteria,
      progress: 0,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    this.goals.set(goal.id, goal);

    return goal;
  }

  public getGoal(id: string): AIGoal | undefined {
    return this.goals.get(id);
  }

  public updateStatus(
    id: string,
    status: AIGoalStatus,
  ): AIGoal {
    const goal = this.goals.get(id);

    if (!goal) {
      throw new Error(`Goal not found: ${id}`);
    }

    const updatedGoal: AIGoal = {
      ...goal,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.goals.set(id, updatedGoal);

    return updatedGoal;
  }

  public updateProgress(
    id: string,
    progress: number,
  ): AIGoal {
    const goal = this.goals.get(id);

    if (!goal) {
      throw new Error(`Goal not found: ${id}`);
    }

    if (progress < 0 || progress > 100) {
      throw new Error(
        "Goal progress must be between 0 and 100.",
      );
    }

    const updatedGoal: AIGoal = {
      ...goal,
      progress,
      updatedAt: new Date().toISOString(),
    };

    this.goals.set(id, updatedGoal);

    return updatedGoal;
  }

  public listGoals(): readonly AIGoal[] {
    return Array.from(this.goals.values());
  }
}
