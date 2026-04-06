import type { BaseEntity, BaseFilterRequest } from "./common";
import type { NotificationStatus } from "./enum";

export interface NotificationLogResponse extends BaseEntity {
  recipient: string;
  templateId: string;
  templateName: string;
  status: NotificationStatus;
  sourceEvent: string;
  metadata: Record<string, unknown>; // JSON placeholder
  sentAt: string;
  userId: string;
  bookingId: string;
  retryCount: number;
  errorMessage: string;
}

export interface NotificationLogFilterRequest extends BaseFilterRequest {
  recipient?: string;
  templateId?: string;
  status?: NotificationStatus;
  sourceEvent?: string;
  retryCount?: number;
  sentFrom?: string;
  sentTo?: string;
  keyword?: string;
}
