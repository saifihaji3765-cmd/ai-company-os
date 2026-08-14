export interface SuccessDto<T> {
  readonly data: T;
}

export interface ErrorDto {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: unknown;
  };
}

export interface PaginatedDto<T> {
  readonly data: readonly T[];
  readonly meta: PaginationMetaDto;
}

export interface PaginationMetaDto {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}
