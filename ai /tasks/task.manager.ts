import type {
  AITask,
  AITaskStatus,
} from "./task.types";

export class AITaskManager {
  private readonly tasks = new Map<string, AITask>();

  public createTask(input: {
    readonly missionId: string;
    readonly title: string;
    readonly description: string;
    readonly dependencies?: readonly string[];
  }): AITask {
    const now = new Date().toISOString();

    const task: AITask = {
      id: `task-${Date.now()}`,
      missionId: input.missionId,
      title: input.title,
      description: input.description,
      status: "pending",
      dependencies: input.dependencies ?? [],
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);

    return task;
  }

  public getTask(id: string): AITask | undefined {
    return this.tasks.get(id);
  }

  public updateStatus(
    id: string,
    status: AITaskStatus,
  ): AITask {
    const task = this.tasks.get(id);

    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }

    const updatedTask: AITask = {
      ...task,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updatedTask);

    return updatedTask;
  }

  public listByMission(
    missionId: string,
  ): readonly AITask[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.missionId === missionId,
    );
  }
}
