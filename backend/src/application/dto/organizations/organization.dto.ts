import type {
  OrganizationId,
} from "../../../modules/organizations";

export interface OrganizationDto {
  readonly id: OrganizationId;
  readonly name: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
