package com.example.backend.service;

import com.example.backend.dto.filter.NotificationFilterRequest;
import com.example.backend.dto.request.NotificationTemplateRequest;
import com.example.backend.dto.response.NotificationTemplateResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.NotificationTemplateMapper;
import com.example.backend.model.NotificationTemplate;
import com.example.backend.repository.NotificationTemplateRepository;
import com.example.backend.specification.NotificationSpecification;
import com.example.backend.utils.PagingUtils;
import freemarker.template.Configuration;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import freemarker.template.Template;
import freemarker.template.TemplateException;

@Service
@RequiredArgsConstructor
public class NotificationTemplateService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationTemplateService.class);
    private final NotificationTemplateRepository notificationTemplateRepository;
    private final Configuration freemarkerConfig;
    private final NotificationTemplateMapper notificationTemplateMapper;

    @Transactional
    public NotificationTemplateResponse createTemplate(NotificationTemplateRequest request) {
        logger.info("Creating notification template: {}", request.getName());

        NotificationTemplate template = NotificationTemplate.builder()
                .name(request.getName())
                .type(request.getType())
                .subject(request.getSubject())
                .templateFile(request.getTemplateFile())
                .defaultLanguage(request.getDefaultLanguage())
                .priority(request.getPriority() != null ? request.getPriority() : 0)
                .isActive(true)
                .build();

        try {
            NotificationTemplate saved = notificationTemplateRepository.save(template);
            logger.info("Created notification template: {}", saved);
            logger.info("Template created with ID: {}", saved.getId());
            logger.info("To response created with name: {}", notificationTemplateMapper.toResponse(saved));
            return notificationTemplateMapper.toResponse(saved);
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
        return notificationTemplateMapper.toResponse(template);
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
        template.setTemplateFile(request.getTemplateFile());
        template.setDefaultLanguage(request.getDefaultLanguage());
        template.setPriority(request.getPriority() != null ? request.getPriority() : 0);

        try {
            NotificationTemplate updated = notificationTemplateRepository.save(template);
            logger.info("Template updated: {}", id);
            return notificationTemplateMapper.toResponse(updated);
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
                .map(notificationTemplateMapper::toResponse)
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

    /**
     * Replace {key} placeholders in template content with values from a map.
     */
    public String buildContent(String templateFile, Map<String, Object> model)
            throws IOException, TemplateException {

        Template template = freemarkerConfig.getTemplate("email/" + templateFile);

        try (StringWriter out = new StringWriter()) {
            template.process(model, out);
            return out.toString();
        }
    }
}

