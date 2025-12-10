import type { BaseEntity } from "./common";
import type { CurrencyCode, TransactionStatus, TransactionType } from "./enum";

export interface Transaction extends BaseEntity {
  bookingId: string;
  amount: number;
  currency: CurrencyCode;
  paymentMethod: string; // VISA, VNPAY, etc.
  status: TransactionStatus;
  gatewayRef?: string;
  processedAt?: string;
  transactionType: TransactionType;
}
