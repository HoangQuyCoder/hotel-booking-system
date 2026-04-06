package com.example.backend.controller;

import com.example.backend.dto.filter.NotificationTemplateFilterRequest;
import com.example.backend.dto.filter.NotificationLogFilterRequest;
import com.example.backend.dto.request.NotificationTemplateRequest;
import com.example.backend.dto.response.*;
import com.example.backend.service.NotificationLogService;
import com.example.backend.service.NotificationTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationTemplateService templateService;
    private final NotificationLogService logService;

    // ==================== TEMPLATES ====================

    @PostMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationTemplateResponse>> createTemplate(
            @Valid @RequestBody NotificationTemplateRequest request) {

        NotificationTemplateResponse created = templateService.createTemplate(request);
        return ResponseEntity
                .status(201)
                .body(ApiResponse.success("Notification template created successfully!", created));
    }

    @GetMapping("/templates/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationTemplateResponse>> getTemplate(@PathVariable UUID id) {
        NotificationTemplateResponse template = templateService.getTemplateById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Update notification template successfully", template)
        );
    }

    @PutMapping("/templates/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationTemplateResponse>> updateTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody NotificationTemplateRequest request) {

        NotificationTemplateResponse updated = templateService.updateTemplate(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Update notification template successfully", updated)
        );
    }

    @DeleteMapping("/templates/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable UUID id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Delete notification template successfully")
        );
    }

    @GetMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<NotificationTemplateResponse>>> getAllTemplates(
            NotificationTemplateFilterRequest filter) {

        PagedResponse<NotificationTemplateResponse> paged = templateService.getAllTemplates(filter);
        return ResponseEntity.ok(
                ApiResponse.success("Get list of successful notification samples", paged)
        );
    }

    // ==================== LOGS ====================

    @GetMapping("/logs/{id}")
    public ResponseEntity<ApiResponse<NotificationLogResponse>> getLog(@PathVariable UUID id) {
        NotificationLogResponse log = logService.getLogById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Get details of the success notification.", log)
        );
    }

    // Get notifications by current user or by userId
    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<NotificationLogResponse>>> getMyLogs(
            @RequestParam(required = false) UUID userId) {

        List<NotificationLogResponse> logs = logService.getLogs(userId);
        return ResponseEntity.ok(
                ApiResponse.success("Get list of successful notifications", logs)
        );
    }

    // ADMIN: View the full system log (with paging and filtering)
    @GetMapping("/logs/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<NotificationLogResponse>>> getAllLogs(
            NotificationLogFilterRequest filter) {

        PagedResponse<NotificationLogResponse> paged = logService.getAllLogs(filter);
        return ResponseEntity.ok(
                ApiResponse.success("Get the entire notification history successfully", paged)
        );
    }
}