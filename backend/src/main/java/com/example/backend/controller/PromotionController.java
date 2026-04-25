package com.example.backend.controller;

import com.example.backend.dto.filter.PromotionFilterRequest;
import com.example.backend.dto.request.PromotionRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.PromotionResponse;
import com.example.backend.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/promotions")
public class PromotionController {

        private final PromotionService promotionService;

        // CREATE NEW PROMOTION
        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<PromotionResponse>> createPromotion(
                        @Valid @RequestBody PromotionRequest request) {

                PromotionResponse created = promotionService.createPromotion(request);
                return ResponseEntity
                                .status(201)
                                .body(ApiResponse.success("Create a successful promotion!", created));
        }

        // GET BY ID
        @GetMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<PromotionResponse>> getPromotion(@PathVariable @NonNull UUID id) {
                PromotionResponse promotion = promotionService.getPromotionById(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Get promotion information successfully", promotion));
        }

        // UPDATE PROMOTION
        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<PromotionResponse>> updatePromotion(
                        @PathVariable @NonNull UUID id,
                        @Valid @RequestBody PromotionRequest request) {

                PromotionResponse updated = promotionService.updatePromotion(id, request);
                return ResponseEntity.ok(
                                ApiResponse.success("Promotion program updated successfully", updated));
        }

        // REMOVE PROMOTION
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deletePromotion(@PathVariable @NonNull UUID id) {
                promotionService.deletePromotion(id);
                return ResponseEntity.ok(
                                ApiResponse.ok("Promotion deleted successfully"));
        }

        // GET PROMOTION LIST
        @GetMapping
        @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
        public ResponseEntity<ApiResponse<PagedResponse<PromotionResponse>>> getAllPromotions(
                        PromotionFilterRequest filter) {

                PagedResponse<PromotionResponse> paged = promotionService.getAllPromotions(filter);
                return ResponseEntity.ok(
                                ApiResponse.success("Get promotion list successfully", paged));
        }
}