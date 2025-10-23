package com.example.backend.dto.response;

import com.example.backend.common.PaymentMethod;
import com.example.backend.common.TransactionStatus;
import com.example.backend.common.TransactionType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionResponse {
    private UUID id;
    private UUID bookingId;
    private Double amount;
    private String currency;
    private PaymentMethod paymentMethod;
    private TransactionStatus status;
    private String gatewayRef;
    private LocalDateTime processedAt;
    private TransactionType transactionType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}
