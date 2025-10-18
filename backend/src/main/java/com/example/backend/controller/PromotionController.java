package com.example.backend.controller;

import com.example.backend.dto.request.PromotionRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.PromotionResponse;
import com.example.backend.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionResponse> createPromotion(@Valid @RequestBody PromotionRequest request) {
        return new ResponseEntity<>(promotionService.createPromotion(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionResponse> getPromotion(@PathVariable UUID id) {
        return ResponseEntity.ok(promotionService.getPromotionById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionResponse> updatePromotion(@PathVariable UUID id, @Valid @RequestBody PromotionRequest request) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePromotion(@PathVariable UUID id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<PagedResponse<PromotionResponse>> filterPromotions(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime validFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime validTo,
            @RequestParam(required = false) BigDecimal minBookingAmount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponse<PromotionResponse> result = promotionService.findPromotions(
                code, isActive, validFrom, validTo, minBookingAmount, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(result);
    }
}