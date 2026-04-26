package com.example.backend.controller;

import com.example.backend.dto.filter.BookingFilterRequest;
import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.BookingListResponse;
import com.example.backend.dto.response.BookingResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/bookings")
public class BookingController {

        private final BookingService bookingService;

        // CREATE BOOKING
        @PostMapping
        @PreAuthorize("hasAnyRole('CLIENT', 'STAFF', 'ADMIN')")
        public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
                        @Valid @RequestBody @NonNull BookingRequest request) {

                BookingResponse created = bookingService.createBooking(request);
                return ResponseEntity
                                .status(201)
                                .body(ApiResponse.success("Booking successful!", created));
        }

        // GET BOOKING BY ID
        @GetMapping("/{id}")
        @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'STAFF')")
        public ResponseEntity<ApiResponse<BookingResponse>> getBooking(@PathVariable @NonNull UUID id) {
                BookingResponse booking = bookingService.getBookingById(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Get booking information successfully", booking));
        }

        // UPDATE BOOKING
        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
        public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(
                        @PathVariable @NonNull UUID id,
                        @Valid @RequestBody @NonNull BookingRequest request) {

                BookingResponse updated = bookingService.updateBooking(id, request);
                return ResponseEntity.ok(
                                ApiResponse.success("Booking updated successfully", updated));
        }

        // CANCEL BOOKING
        @DeleteMapping("/{id}")
        @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
        public ResponseEntity<ApiResponse<Void>> cancelBooking(@PathVariable @NonNull UUID id) {
                bookingService.cancelBooking(id);
                return ResponseEntity.ok(
                                ApiResponse.ok("Cancellation successful"));
        }

        // GET ALL BOOKINGS
        @GetMapping
        @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'STAFF')")
        public ResponseEntity<ApiResponse<PagedResponse<BookingListResponse>>> getAllBookings(
                        BookingFilterRequest filter) {

                PagedResponse<BookingListResponse> paged = bookingService.getAllBookings(filter);
                return ResponseEntity.ok(
                                ApiResponse.success("Get list of successful bookings", paged));
        }

        // CHECK-IN
        @PutMapping("/{id}/check-in")
        @PreAuthorize("hasRole('STAFF')")
        public ResponseEntity<ApiResponse<BookingResponse>> checkInBooking(@PathVariable @NonNull UUID id) {
                BookingResponse checkedIn = bookingService.checkInBooking(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Check-in successful", checkedIn));
        }

        // CHECK-OUT
        @PutMapping("/{id}/check-out")
        @PreAuthorize("hasRole('STAFF')")
        public ResponseEntity<ApiResponse<BookingResponse>> checkOutBooking(@PathVariable @NonNull UUID id) {
                BookingResponse checkedOut = bookingService.checkOutBooking(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Check-out successful", checkedOut));
        }
}