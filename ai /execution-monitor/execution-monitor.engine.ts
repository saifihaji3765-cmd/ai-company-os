import type {
  AIExecutionRecord,
  AIExecutionStatus,
} from "./execution-monitor.types";

export interface AIExecutionMonitor {
  start(input: {
    readonly missionId: string;
    readonly taskId: string;
    readonly metadata?: Readonly<Record<string, unknown>>;
  }): Promise<AIExecutionRecord>;

  updateStatus(
    id: string,
    status: AIExecutionStatus,
    details?: {
      readonly output?: unknown;
      readonly error?: string;
    },
  ): Promise<AIExecutionRecord>;

  get(id: string): Promise<AIExecutionRecord | undefined>;

  listByMission(
    missionId: string,
  ): Promise<readonly AIExecutionRecord[]>;
}

export class BasicExecutionMonitor
  implements AIExecutionMonitor
{
  private readonly executions =
    new Map<string, AIExecutionRecord>();

  public async start(input: {
    readonly missionId: string;
    readonly taskId: string;
    readonly metadata?: Readonly<Record<string, unknown>>;
  }): Promise<AIExecutionRecord> {
    const record: AIExecutionRecord = {
      id: `execution-${Date.now()}`,
      missionId: input.missionId,
      taskId: input.taskId,
      status: "running",
      startedAt: new Date().toISOString(),
      metadata: input.metadata ?? {},
    };

    this.executions.set(record.id, record);

    return record;
  }

  public async updateStatus(
    id: string,
    status: AIExecutionStatus,
    details?: {
      readonly output?: unknown;
      readonly error?: string;
    },
  ): Promise<AIExecutionRecord> {
    const execution = this.executions.get(id);

    if (!execution) {
      throw new Error(`Execution not found: ${id}`);
    }

    const terminalStatuses: AIExecutionStatus[] = [
      "completed",
      "failed",
      "cancelled",
    ];

    const updated: AIExecutionRecord = {
      ...execution,
      status,
      output: details?.output ?? execution.output,
      error: details?.error ?? execution.error,
      completedAt: terminalStatuses.includes(status)
        ? new Date().toISOString()
        : execution.completedAt,
    };

    this.executions.set(id, updated);

    return updated;
  }

  public async get(
    id: string,
  ): Promise<AIExecutionRecord | undefined> {
    return this.executions.get(id);
  }

  public async listByMission(
    missionId: string,
  ): Promise<readonly AIExecutionRecord[]> {
    return Array.from(this.executions.values()).filter(
      (execution) => execution.missionId === missionId,
    );
  }
}
