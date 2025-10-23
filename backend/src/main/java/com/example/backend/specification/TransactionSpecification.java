package com.example.backend.specification;

import com.example.backend.dto.filter.TransactionFilterRequest;
import com.example.backend.model.Transaction;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class TransactionSpecification {
    private static final Specification<Transaction> spec = SpecUtils.empty();

    public static Specification<Transaction> build(TransactionFilterRequest filter) {
        return spec.and(SpecUtils.nestedEqualIfNotNull("booking", "id", filter.getBookingId()))
                .and(SpecUtils.likeIfNotNull("paymentMethod", filter.getPaymentMethod()))
                .and(SpecUtils.equalIfNotNull("currency", filter.getCurrency()))
                .and(SpecUtils.equalIfNotNull("status", filter.getStatus()))
                .and(SpecUtils.equalIfNotNull("transactionType", filter.getTransactionType()))
                .and(SpecUtils.betweenIfNotNull("processedAt", filter.getProcessedFrom(), filter.getProcessedTo()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.likeIfNotNull("gatewayRef", filter.getGatewayRef()));
    }
}
