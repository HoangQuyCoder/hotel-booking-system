package com.example.backend.specification;

import com.example.backend.dto.filter.NotificationTemplateFilterRequest;
import com.example.backend.model.NotificationTemplate;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class NotificationSpecification {
    private static final Specification<NotificationTemplate> spec = SpecUtils.empty();

    public static Specification<NotificationTemplate> build(NotificationTemplateFilterRequest filter) {
        return spec.and(SpecUtils.likeIfNotNull("name", filter.getName()))
                .and(SpecUtils.likeIfNotNull("subject", filter.getSubject()))
                .and(SpecUtils.equalIfNotNull("defaultLanguage", filter.getDefaultLanguage()))
                .and(SpecUtils.greaterThanOrEqualIfNotNull("priority", filter.getPriorityMin()))
                .and(SpecUtils.lessThanOrEqualIfNotNull("priority", filter.getPriorityMax()))
                .and(SpecUtils.equalIfNotNull("type", filter.getType()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filter.getCreatedFrom(), filter.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filter.getUpdatedFrom(), filter.getUpdatedTo()));
    }
}
