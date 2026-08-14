export interface CreateWorkspaceDto {
  readonly organizationId: string;
  readonly name: string;
}

export interface UpdateWorkspaceDto {
  readonly name?: string;
}
