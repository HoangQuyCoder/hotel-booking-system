import type { BaseEntity, BaseFilterRequest } from "./common";
import type { LanguageCode, NotificationType } from "./enum";

export interface NotificationTemplateResponse extends BaseEntity {
  name: string;
  type: NotificationType;
  subject: string;
  templateFile: string;
  defaultLanguage: LanguageCode;
  priority: number;
}

export interface NotificationTemplateRequest {
  name: string;
  type: NotificationType;
  subject?: string;
  templateFile: string;
  defaultLanguage?: LanguageCode;
  priority?: number;
}

export interface NotificationTemplateFilterRequest extends BaseFilterRequest {
  name?: string;
  type?: NotificationType;
  subject?: string;
  defaultLanguage?: LanguageCode;
  priorityMin?: number;
  priorityMax?: number;
}
