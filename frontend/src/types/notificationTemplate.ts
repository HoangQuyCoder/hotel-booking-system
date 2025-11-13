import type { BaseEntity } from "./common";
import type { LanguageCode, NotificationType } from "./enum";

export interface NotificationTemplate extends BaseEntity {
  name: string;
  type: NotificationType;
  subject?: string;
  content: string;
  defaultLanguage: LanguageCode;
  priority: number;
}
