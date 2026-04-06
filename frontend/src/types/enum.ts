export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  LOCKED_TEMP: "LOCKED_TEMP",
  LOCKED_PERMANENT: "LOCKED_PERMANENT",
  PENDING: "PENDING",
  BANNED: "BANNED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const RoomStatus = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  MAINTENANCE: "MAINTENANCE",
} as const;
export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];

export const RoleName = {
  CLIENT: "CLIENT",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  MANAGER: "MANAGER",
} as const;
export type RoleName = (typeof RoleName)[keyof typeof RoleName];

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const TransactionStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const TransactionType = {
  PAYMENT: "PAYMENT",
  REFUNDED: "REFUNDED",
} as const;
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const NotificationType = {
  EMAIL: "EMAIL",
  SMS: "SMS",
  PUSH: "PUSH",
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationStatus = {
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
  RETRYING: "RETRYING",
} as const;
export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const LanguageCode = {
  VI: "vi",
  EN: "en",
} as const;
export type LanguageCode = (typeof LanguageCode)[keyof typeof LanguageCode];

export const CurrencyCode = {
  VND: "VND",
  USD: "USD",
} as const;
export type CurrencyCode = (typeof CurrencyCode)[keyof typeof CurrencyCode];

export const PaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
  MOBILE_PAYMENT: "MOBILE_PAYMENT",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
