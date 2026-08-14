import type {
  WorkspaceId,
} from "../../../modules/workspaces";

export interface WorkspaceDto {
  readonly id: WorkspaceId;
  readonly organizationId: string;
  readonly name: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
