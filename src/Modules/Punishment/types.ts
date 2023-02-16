export interface CreatePunishmentInput {
  userId: string;
  createdById: string;
  typeId: string;
  reasonId: string;
  organizationId: string;
  description?: string;
  proof?: string;
  quantity: number;
  approved?: boolean;
}
