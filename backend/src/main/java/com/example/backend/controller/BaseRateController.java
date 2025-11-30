package com.example.backend.controller;

import com.example.backend.dto.filter.BaseRateFilterRequest;
import com.example.backend.dto.request.BaseRateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.BaseRateResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.BaseRateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/base-rates")
public class BaseRateController {

    private final BaseRateService baseRateService;

    // CREATE BASE RATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BaseRateResponse>> createBaseRate(
            @Valid @RequestBody BaseRateRequest request) {

        BaseRateResponse created = baseRateService.createBaseRate(request);
        return ResponseEntity
                .status(201)
                .body(ApiResponse.success("Create a successful base price!", created));
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BaseRateResponse>> getBaseRate(@PathVariable UUID id) {
        BaseRateResponse baseRate = baseRateService.getBaseRateById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Get price information successfully", baseRate)
        );
    }

    // UPDATE BASE RATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BaseRateResponse>> updateBaseRate(
            @PathVariable UUID id,
            @Valid @RequestBody BaseRateRequest request) {

        BaseRateResponse updated = baseRateService.updateBaseRate(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Basic price update successful", updated)
        );
    }

    // DELETE BASE RATE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBaseRate(@PathVariable UUID id) {
        baseRateService.deleteBaseRate(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Base price deleted successfully")
        );
    }

    // GET ALL (with pagination and filter)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<BaseRateResponse>>> getAllBaseRates(
            BaseRateFilterRequest filterRequest) {

        PagedResponse<BaseRateResponse> paged = baseRateService.getAllBaseRates(filterRequest);
        return ResponseEntity.ok(
                ApiResponse.success("Get basic price list successfully", paged)
        );
    }
}