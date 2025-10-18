package com.example.backend.controller;

import com.example.backend.dto.request.BaseRateRequest;
import com.example.backend.dto.response.BaseRateResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.BaseRateService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/base-rates")
public class BaseRateController {

    private final BaseRateService baseRateService;

    public BaseRateController(BaseRateService baseRateService) {
        this.baseRateService = baseRateService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseRateResponse> createBaseRate(@Valid @RequestBody BaseRateRequest request) {
        return new ResponseEntity<>(baseRateService.createBaseRate(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseRateResponse> getBaseRate(@PathVariable UUID id) {
        return ResponseEntity.ok(baseRateService.getBaseRateById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseRateResponse> updateBaseRate(@PathVariable UUID id, @Valid @RequestBody BaseRateRequest request) {
        return ResponseEntity.ok(baseRateService.updateBaseRate(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBaseRate(@PathVariable UUID id) {
        baseRateService.deleteBaseRate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PagedResponse<BaseRateResponse>> filterBaseRates(
            @RequestParam(required = false) UUID roomTypeId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponse<BaseRateResponse> result = baseRateService.findBaseRates(
                roomTypeId, isActive, minPrice, maxPrice, startDate, endDate,
                page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(result);
    }
}
