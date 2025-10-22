package com.example.backend.controller;

import com.example.backend.dto.filter.HotelFilterRequest;
import com.example.backend.dto.request.HotelRequest;
import com.example.backend.dto.request.HotelUpdateRequest;
import com.example.backend.dto.response.HotelResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hotels")
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelResponse> createHotel(@Valid @RequestBody HotelRequest request) {
        return new ResponseEntity<>(hotelService.createHotel(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelResponse> getHotel(@PathVariable UUID id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelResponse> updateHotel(@PathVariable UUID id, @Valid @RequestBody HotelUpdateRequest request) {
        return ResponseEntity.ok(hotelService.updateHotel(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHotel(@PathVariable UUID id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PagedResponse<HotelResponse>> getAllHotels(HotelFilterRequest filter) {
        PagedResponse<HotelResponse> response = hotelService.getAllHotels(filter);
        return ResponseEntity.ok(response);
    }
}
