package com.example.backend.service;

import com.example.backend.dto.filter.NotificationFilterRequest;
import com.example.backend.dto.request.NotificationTemplateRequest;
import com.example.backend.dto.response.NotificationTemplateResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.NotificationTemplate;
import com.example.backend.repository.NotificationTemplateRepository;
import com.example.backend.specification.NotificationSpecification;
import com.example.backend.utils.PagingUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationTemplateService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationTemplateService.class);
    private final NotificationTemplateRepository notificationTemplateRepository;

    @Transactional
    public NotificationTemplateResponse createTemplate(NotificationTemplateRequest request) {
        logger.info("Creating notification template: {}", request.getName());

        NotificationTemplate template = NotificationTemplate.builder()
                .name(request.getName())
                .type(request.getType())
                .subject(request.getSubject())
                .content(request.getContent())
                .defaultLanguage(request.getDefaultLanguage())
                .priority(request.getPriority() != null ? request.getPriority() : 0)
                .isActive(true)
                .build();

        try {
            NotificationTemplate saved = notificationTemplateRepository.save(template);
            logger.info("Template created with ID: {}", saved.getId());
            return mapTemplateToResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create template {}: {}", request.getName(), e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to create template");
        }
    }

    public NotificationTemplateResponse getTemplateById(UUID id) {
        logger.debug("Fetching template by ID: {}", id);

        NotificationTemplate template = notificationTemplateRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Notification template not found for ID: {}", id);
                    return new ResourceNotFoundException("Template not found");
                });

        logger.info("Template retrieved successfully: {}", template.getName());
        return mapTemplateToResponse(template);
    }

    @Transactional
    public NotificationTemplateResponse updateTemplate(UUID id, NotificationTemplateRequest request) {
        NotificationTemplate template = notificationTemplateRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Notification template not found for ID: {}", id);
                    return new ResourceNotFoundException("Template not found");
                });

        template.setName(request.getName());
        template.setType(request.getType());
        template.setSubject(request.getSubject());
        template.setContent(request.getContent());
        template.setDefaultLanguage(request.getDefaultLanguage());
        template.setPriority(request.getPriority() != null ? request.getPriority() : 0);

        try {
            NotificationTemplate updated = notificationTemplateRepository.save(template);
            logger.info("Template updated: {}", id);
            return mapTemplateToResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update template {}: {}", request.getName(), e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to update template");
        }
    }

    @Transactional
    public void deleteTemplate(UUID id) {
        logger.warn("Deactivating template with ID: {}", id);

        NotificationTemplate template = notificationTemplateRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[delete] Notification template not found for ID: {}", id);
                    return new ResourceNotFoundException("Template not found");
                });
        template.setIsActive(false);

        try {
            notificationTemplateRepository.save(template);
            logger.info("Template soft deleted: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete template {}: {}", id, e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to delete template");
        }
    }

    @Transactional(readOnly = true)
    public PagedResponse<NotificationTemplateResponse> getAllTemplates(NotificationFilterRequest filterRequest) {
        logger.info("Fetching notification template with filters: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);
        Specification<NotificationTemplate> spec = NotificationSpecification.build(filterRequest);

        // Execute query
        Page<NotificationTemplate> pageResult = notificationTemplateRepository.findAll(spec, pageable);

        List<NotificationTemplateResponse> content = pageResult.getContent().stream()
                .map(this::mapTemplateToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }

    public NotificationTemplate getTemplate(String name) {
        return notificationTemplateRepository.findByName(name)
                .orElseThrow(() -> {
                    logger.error("{} template not found", name);
                    return new IllegalStateException(name + " template not found");
                });
    }

    private NotificationTemplateResponse mapTemplateToResponse(NotificationTemplate t) {
        NotificationTemplateResponse r = new NotificationTemplateResponse();
        r.setId(t.getId());
        r.setName(t.getName());
        r.setType(t.getType());
        r.setSubject(t.getSubject());
        r.setContent(t.getContent());
        r.setCreatedAt(t.getCreatedAt());
        r.setUpdatedAt(t.getUpdatedAt());
        r.setIsActive(t.getIsActive());
        r.setDefaultLanguage(t.getDefaultLanguage());
        r.setPriority(t.getPriority());
        return r;
    }

    /**
     * Replace {key} placeholders in template content with values from a map.
     */
    public String buildContent(NotificationTemplate template, Map<String, String> placeholders) {
        String content = template.getContent();
        for (Map.Entry<String, String> entry : placeholders.entrySet()) {
            content = content.replace("{" + entry.getKey() + "}", entry.getValue());
        }
        return content;
    }
}

