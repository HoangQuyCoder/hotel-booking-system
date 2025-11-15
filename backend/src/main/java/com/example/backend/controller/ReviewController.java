package com.example.backend.controller;

import com.example.backend.dto.filter.ReviewFilterRequest;
import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ReviewResponse> create(@RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.create(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ReviewResponse> update(
            @PathVariable UUID id,
            @RequestBody ReviewRequest request
    ) {
        ReviewResponse response = reviewService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build(); // HTTP 204
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getOne(@PathVariable UUID id) {
        ReviewResponse response = reviewService.getReviewById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ReviewResponse>> getAll(ReviewFilterRequest filter) {
        PagedResponse<ReviewResponse> responses = reviewService.getAll(filter);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{hotelId}")
    public ResponseEntity<PagedResponse<ReviewResponse>> getReviewsByHotelId(@PathVariable UUID hotelId,
                                                                             @RequestParam(defaultValue = "0") int page,
                                                                             @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ReviewResponse> responses = reviewService.getReviewsByHotelId(hotelId, page, size);
        return ResponseEntity.ok(responses);
    }
}
