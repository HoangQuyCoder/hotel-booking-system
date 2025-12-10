package com.example.backend.dto.filter;

import com.example.backend.common.TransactionStatus;
import com.example.backend.common.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TransactionFilterRequest extends BaseFilterRequest {
    private UUID bookingId;
    private String paymentMethod;
    private String currency;
    private TransactionStatus status;
    private TransactionType transactionType;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime processedFrom;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime processedTo;

    private String gatewayRef;
}

