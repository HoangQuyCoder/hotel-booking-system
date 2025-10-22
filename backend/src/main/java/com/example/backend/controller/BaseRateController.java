package com.example.backend.controller;

import com.example.backend.dto.filter.BaseRateFilterRequest;
import com.example.backend.dto.request.BaseRateRequest;
import com.example.backend.dto.response.BaseRateResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.BaseRateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/base-rates")
public class BaseRateController {

    private final BaseRateService baseRateService;

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<BaseRateResponse>> getAllBaseRates(BaseRateFilterRequest filterRequest) {
        PagedResponse<BaseRateResponse> result = baseRateService.getAllBaseRates(filterRequest);
        return ResponseEntity.ok(result);
    }
}
