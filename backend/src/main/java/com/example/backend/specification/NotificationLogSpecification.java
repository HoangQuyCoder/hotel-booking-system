package com.example.backend.specification;

import com.example.backend.dto.filter.NotificationLogFilterRequest;
import com.example.backend.model.NotificationLog;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class NotificationLogSpecification {
    private static final Specification<NotificationLog> spec = SpecUtils.empty();

    public static Specification<NotificationLog> build(NotificationLogFilterRequest filter) {
        return spec.and(SpecUtils.likeIfNotNull("recipient", filter.getRecipient()))
                .and(SpecUtils.nestedEqualIfNotNull("template", "id", filter.getTemplateId()))
                .and(SpecUtils.equalIfNotNull("status", filter.getStatus()))
                .and(SpecUtils.likeIfNotNull("sourceEvent", filter.getSourceEvent()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.equalIfNotNull("retryCount", filter.getRetryCount()))
                .and(SpecUtils.betweenIfNotNull("sentAt", filter.getSentFrom(), filter.getSentTo()))
                .and(SpecUtils.keywordSearch(filter.getKeyword(), "recipient", "sourceEvent", "errorMessage"));

    }
}
