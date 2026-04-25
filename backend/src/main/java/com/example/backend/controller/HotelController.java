package com.example.backend.controller;

import com.example.backend.dto.filter.HotelFilterRequest;
import com.example.backend.dto.request.HotelRequest;
import com.example.backend.dto.request.HotelUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.HotelDetailResponse;
import com.example.backend.dto.response.HotelListResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hotels")
public class HotelController {

        private final HotelService hotelService;

        // CREATE A HOTEL
        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<HotelDetailResponse>> createHotel(
                        @Valid @RequestBody HotelRequest request) {

                HotelDetailResponse created = hotelService.createHotel(request);
                return ResponseEntity
                                .status(201)
                                .body(ApiResponse.success("Create a successful hotel!", created));
        }

        // GET HOTEL BY ID
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<HotelDetailResponse>> getHotel(@PathVariable @NonNull UUID id) {
                HotelDetailResponse hotel = hotelService.getHotelById(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Get hotel information successfully", hotel));
        }

        // UPDATE HOTEL
        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<HotelDetailResponse>> updateHotel(
                        @PathVariable @NonNull UUID id,
                        @Valid @RequestBody HotelUpdateRequest request) {

                HotelDetailResponse updated = hotelService.updateHotel(id, request);
                return ResponseEntity.ok(
                                ApiResponse.success("Hotel update successful", updated));
        }

        // DELETE HOTEL
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable @NonNull UUID id) {
                hotelService.deleteHotel(id);
                return ResponseEntity.ok(
                                ApiResponse.ok("Delete hotel successfully"));
        }

        // GET ALL HOTELS (with pagination and filter)
        @GetMapping
        public ResponseEntity<ApiResponse<PagedResponse<HotelListResponse>>> getAllHotels(
                        HotelFilterRequest filter) {

                PagedResponse<HotelListResponse> paged = hotelService.getAllHotels(filter);
                return ResponseEntity.ok(
                                ApiResponse.success("Get hotel list successfully", paged));
        }

        // SEARCH CITIES
        @GetMapping("/cities")
        public ResponseEntity<ApiResponse<List<String>>> getCities(@RequestParam String q) {
                List<String> cities = hotelService.findDistinctCitiesContaining(q);
                return ResponseEntity.ok(
                                ApiResponse.success("Get city list successfully", cities));
        }

        // Featured
        @GetMapping("/featured")
        public ResponseEntity<ApiResponse<List<HotelListResponse>>> getFeaturedHotels() {
                return ResponseEntity.ok(
                                ApiResponse.success("Featured hotels", hotelService.getFeaturedHotels()));
        }

        // Top rating
        @GetMapping("/top-rated")
        public ResponseEntity<ApiResponse<List<HotelListResponse>>> getTopRatedHotels() {
                return ResponseEntity.ok(
                                ApiResponse.success("Top rated hotels", hotelService.getTopRatedHotels()));
        }

        // Newest
        @GetMapping("/newest")
        public ResponseEntity<ApiResponse<List<HotelListResponse>>> getNewestHotels() {
                return ResponseEntity.ok(
                                ApiResponse.success("Newest hotels", hotelService.getNewestHotels()));
        }

        // Discover by city
        @GetMapping("/discover")
        public ResponseEntity<ApiResponse<List<HotelListResponse>>> discoverByCity(
                        @RequestParam String city) {
                return ResponseEntity.ok(
                                ApiResponse.success("Hotels by city", hotelService.getHotelsByCity(city)));
        }

        // Nearby
        @GetMapping("/nearby")
        public ResponseEntity<ApiResponse<List<HotelListResponse>>> getNearbyHotels(
                        @RequestParam Double lat,
                        @RequestParam Double lng) {
                return ResponseEntity.ok(
                                ApiResponse.success("Nearby hotels", hotelService.getNearbyHotels(lat, lng)));
        }
}