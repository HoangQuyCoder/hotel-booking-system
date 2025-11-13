package com.example.backend.controller;

import com.example.backend.dto.filter.HotelFilterRequest;
import com.example.backend.dto.request.HotelRequest;
import com.example.backend.dto.request.HotelUpdateRequest;
import com.example.backend.dto.response.HotelDetailResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hotels")
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDetailResponse> createHotel(@Valid @RequestBody HotelRequest request) {
        return new ResponseEntity<>(hotelService.createHotel(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDetailResponse> getHotel(@PathVariable UUID id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDetailResponse> updateHotel(@PathVariable UUID id, @Valid @RequestBody HotelUpdateRequest request) {
        return ResponseEntity.ok(hotelService.updateHotel(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHotel(@PathVariable UUID id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PagedResponse<HotelDetailResponse>> getAllHotels(HotelFilterRequest filter) {
        PagedResponse<HotelDetailResponse> response = hotelService.getAllHotels(filter);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getCities(@RequestParam String q) {
        List<String> cities = hotelService.findDistinctCitiesContaining(q);
        return ResponseEntity.ok(cities);
    }
}
