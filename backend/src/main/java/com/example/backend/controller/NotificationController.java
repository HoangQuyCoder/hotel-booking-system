package com.example.backend.controller;

import com.example.backend.dto.filter.NotificationFilterRequest;
import com.example.backend.dto.filter.NotificationLogFilterRequest;
import com.example.backend.dto.request.NotificationTemplateRequest;
import com.example.backend.dto.response.NotificationLogResponse;
import com.example.backend.dto.response.NotificationTemplateResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.NotificationLogService;
import com.example.backend.service.NotificationTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationLogService notificationLogService;
    private final NotificationTemplateService notificationTemplateService;

    // === TEMPLATES ===

    @PostMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationTemplateResponse> createTemplate(
            @Valid @RequestBody NotificationTemplateRequest request) {
        return new ResponseEntity<>(notificationTemplateService.createTemplate(request), HttpStatus.CREATED);
    }

    @GetMapping("/templates/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationTemplateResponse> getTemplate(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationTemplateService.getTemplateById(id));
    }

    @PutMapping("/templates/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationTemplateResponse> updateTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody NotificationTemplateRequest request) {
        return ResponseEntity.ok(notificationTemplateService.updateTemplate(id, request));
    }

    @DeleteMapping("/templates/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable UUID id) {
        notificationTemplateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<NotificationTemplateResponse>> getAllTemplates(NotificationFilterRequest filterRequest) {
        return ResponseEntity.ok(notificationTemplateService.getAllTemplates(filterRequest));
    }

    // === LOGS ===

    @GetMapping("/logs/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<NotificationLogResponse> getLog(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationLogService.getLogById(id));
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<List<NotificationLogResponse>> getLogs(
            @RequestParam(required = false) UUID userId) {
        return ResponseEntity.ok(notificationLogService.getLogs(userId));
    }

    @GetMapping("/logs/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<NotificationLogResponse>> getAllLogs(NotificationLogFilterRequest filterRequest) {
        return ResponseEntity.ok(notificationLogService.getAllLogs(filterRequest));
    }
}
