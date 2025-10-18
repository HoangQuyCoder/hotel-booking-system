package com.example.backend.controller;

import com.example.backend.dto.request.DailyOverrideRequest;
import com.example.backend.dto.response.DailyOverrideResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.DailyOverrideService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/daily-overrides")
public class DailyOverrideController {

    private final DailyOverrideService dailyOverrideService;

    public DailyOverrideController(DailyOverrideService dailyOverrideService) {
        this.dailyOverrideService = dailyOverrideService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DailyOverrideResponse> createDailyOverride(@Valid @RequestBody DailyOverrideRequest request) {
        return new ResponseEntity<>(dailyOverrideService.createDailyOverride(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DailyOverrideResponse> getDailyOverride(@PathVariable UUID id) {
        return ResponseEntity.ok(dailyOverrideService.getDailyOverrideById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DailyOverrideResponse> updateDailyOverride(@PathVariable UUID id, @Valid @RequestBody DailyOverrideRequest request) {
        return ResponseEntity.ok(dailyOverrideService.updateDailyOverride(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDailyOverride(@PathVariable UUID id) {
        dailyOverrideService.deleteDailyOverride(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<DailyOverrideResponse>> findDailyOverrides(
            @RequestParam(required = false) UUID roomTypeId,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(dailyOverrideService.findDailyOverrides(roomTypeId, date, page, size, sortBy, sortDir));
    }
}