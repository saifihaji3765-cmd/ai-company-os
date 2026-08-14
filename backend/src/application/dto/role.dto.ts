import type {
  RoleId,
} from "../../../modules/roles";

export interface RoleDto {
  readonly id: RoleId;
  readonly organizationId: string;
  readonly name: string;
  readonly description: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
