package com.example.backend.controller;

import com.example.backend.dto.filter.ReviewFilterRequest;
import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    // CREATE REVIEW
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody ReviewRequest request) {

        ReviewResponse created = reviewService.create(request);
        return ResponseEntity
                .status(201)
                .body(ApiResponse.success("Review submitted successfully! Thank you for sharing your experience.", created));
    }

    // UPDATE REVIEW
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewRequest request) {

        ReviewResponse updated = reviewService.update(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Update review successful", updated)
        );
    }

    // DELETE REVIEW
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable UUID id) {
        reviewService.delete(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Review deleted successfully")
        );
    }

    // GET ONE REVIEW
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReview(@PathVariable UUID id) {
        ReviewResponse review = reviewService.getReviewById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Get evaluation information successfully", review)
        );
    }

    // GET ALL REVIEWS (admin + filter)
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getAllReviews(
            ReviewFilterRequest filter) {

        PagedResponse<ReviewResponse> paged = reviewService.getAll(filter);
        return ResponseEntity.ok(
                ApiResponse.success("Get the list of successful reviews", paged)
        );
    }

    // GET REVIEWS BY HOTEL
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getReviewsByHotelId(
            @PathVariable UUID hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PagedResponse<ReviewResponse> paged = reviewService.getReviewsByHotelId(hotelId, page, size);
        return ResponseEntity.ok(
                ApiResponse.success("Get hotel reviews successfully", paged)
        );
    }
}