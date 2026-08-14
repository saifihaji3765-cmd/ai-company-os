export interface CreateRoleDto {
  readonly organizationId: string;
  readonly name: string;
  readonly description: string;
}

export interface UpdateRoleDto {
  readonly name?: string;
  readonly description?: string;
  readonly status?: string;
}
