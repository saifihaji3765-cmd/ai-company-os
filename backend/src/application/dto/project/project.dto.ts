import type {
  ProjectId,
} from "../../../modules/projects";

export interface ProjectDto {
  readonly id: ProjectId;
  readonly workspaceId: string;
  readonly name: string;
  readonly description: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
