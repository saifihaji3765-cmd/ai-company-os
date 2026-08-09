export type Brand<T, TBrand extends string> = T & {
  readonly __brand: TBrand;
};

export type UserId = Brand<string, "UserId">;
export type AgentId = Brand<string, "AgentId">;
export type MissionId = Brand<string, "MissionId">;
export type WorkflowId = Brand<string, "WorkflowId">;
export type TaskId = Brand<string, "TaskId">;
export type RequestId = Brand<string, "RequestId">;
export type CorrelationId = Brand<string, "CorrelationId">;

export type ISODateString = Brand<string, "ISODateString">;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonObject
  | JsonValue[];

export interface JsonObject {
  readonly [key: string]: JsonValue;
}

export interface PaginationInput {
  readonly page: number;
  readonly pageSize: number;
}

export interface PaginationMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}

export interface Paginated<T> {
  readonly items: readonly T[];
  readonly meta: PaginationMeta;
}
