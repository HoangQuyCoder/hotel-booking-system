package com.example.backend.controller;

import com.example.backend.dto.filter.DailyOverrideFilterRequest;
import com.example.backend.dto.request.DailyOverrideRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.DailyOverrideResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.DailyOverrideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/daily-overrides")
public class DailyOverrideController {

    private final DailyOverrideService dailyOverrideService;

    // CREATE DAILY SPECIALS
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DailyOverrideResponse>> createDailyOverride(
            @Valid @RequestBody DailyOverrideRequest request) {

        DailyOverrideResponse created = dailyOverrideService.createDailyOverride(request);
        return ResponseEntity
                .status(201)
                .body(ApiResponse.success("Created special daily price successfully!", created));
    }

    // GET DETAILS
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DailyOverrideResponse>> getDailyOverride(@PathVariable UUID id) {
        DailyOverrideResponse override = dailyOverrideService.getDailyOverrideById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Get special price information successfully", override)
        );
    }

    // UPDATE SPECIAL PRICE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DailyOverrideResponse>> updateDailyOverride(
            @PathVariable UUID id,
            @Valid @RequestBody DailyOverrideRequest request) {

        DailyOverrideResponse updated = dailyOverrideService.updateDailyOverride(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Updated special price by date successfully", updated)
        );
    }

    // DELETE SPECIAL PRICE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDailyOverride(@PathVariable UUID id) {
        dailyOverrideService.deleteDailyOverride(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Delete special price by date successfully")
        );
    }

    // GET LIST (pagination and filtering)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<DailyOverrideResponse>>> getAllDailyOverrides(
            DailyOverrideFilterRequest filter) {

        PagedResponse<DailyOverrideResponse> paged = dailyOverrideService.getAllDailyOverrides(filter);
        return ResponseEntity.ok(
                ApiResponse.success("Get special price list successfully", paged)
        );
    }
}