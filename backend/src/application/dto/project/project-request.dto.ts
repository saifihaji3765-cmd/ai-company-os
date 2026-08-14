export interface CreateProjectDto {
  readonly workspaceId: string;
  readonly name: string;
  readonly description: string;
}

export interface UpdateProjectDto {
  readonly name?: string;
  readonly description?: string;
  readonly status?: string;
}
