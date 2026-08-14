export interface PaginationDto {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}

export interface PaginationRequestDto {
  readonly page?: number;
  readonly pageSize?: number;
}
