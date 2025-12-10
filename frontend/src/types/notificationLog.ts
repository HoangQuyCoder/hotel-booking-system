import type { BaseEntity } from "./common";
import type { NotificationStatus } from "./enum";
import type { NotificationTemplate } from "./notificationTemplate";

export interface NotificationLog extends BaseEntity {
  recipient: string; // email hoặc số điện thoại
  templateId: string;
  template?: NotificationTemplate;
  status: NotificationStatus;
  sourceEvent?: string;
  metadata?: Record<string, unknown>; // JSON placeholder
  sentAt?: string;
  retryCount: number;
  errorMessage?: string;
}
