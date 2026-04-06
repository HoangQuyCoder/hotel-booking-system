import type { BaseEntity, BaseFilterRequest } from "./common";
import type {
  CurrencyCode,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "./enum";
import type { BookingListResponse } from "./booking";

export interface TransactionResponse extends BaseEntity {
  booking: BookingListResponse;
  amount: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  gatewayRef?: string;
  processedAt?: string;
  transactionType: TransactionType;
}

export interface TransactionRequest {
  bookingId: string;
  amount: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  gatewayRef?: string;
}

export interface TransactionFilterRequest extends BaseFilterRequest {
  bookingId?: string;
  currency?: CurrencyCode;
  paymentMethod?: PaymentMethod;
  status?: TransactionStatus;
  transactionType?: TransactionType;
  gatewayRef?: string;
  processedFrom?: string;
  processedTo?: string;
}
