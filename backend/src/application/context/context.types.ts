export type ApplicationContextSource =
  | "http"
  | "job"
  | "agent"
  | "system";

export interface ApplicationContext {
  readonly requestId: string;
  readonly correlationId: string;
  readonly source: ApplicationContextSource;
  readonly startedAt: string;
}
