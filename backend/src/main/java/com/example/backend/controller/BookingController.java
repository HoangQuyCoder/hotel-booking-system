package com.example.backend.controller;

import com.example.backend.dto.filter.BookingFilterRequest;
import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.BookingResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'STAFF', 'ADMIN')")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return new ResponseEntity<>(bookingService.createBooking(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'STAFF')")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<BookingResponse> updateBooking(@PathVariable UUID id, @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<Void> cancelBooking(@PathVariable UUID id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'STAFF')")
    public ResponseEntity<PagedResponse<BookingResponse>> getAllBookings(BookingFilterRequest filter) {
        return ResponseEntity.ok(bookingService.getAllBookings(filter));
    }

    @PutMapping("/{id}/check-in")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<BookingResponse> checkInBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.checkInBooking(id));
    }

    @PutMapping("/{id}/check-out")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<BookingResponse> checkOutBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.checkOutBooking(id));
    }
}
