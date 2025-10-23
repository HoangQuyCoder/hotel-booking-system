package com.example.backend.dto.request;

import com.example.backend.common.PaymentMethod;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;

@Data
public class TransactionRequest {
    @NotNull(message = "Booking ID is required")
    private UUID bookingId;

    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be non-negative")
    private Double amount;

    @NotBlank(message = "Currency is required")
    @Size(max = 10, message = "Currency must not exceed 10 characters")
    private String currency;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String gatewayRef;
}
