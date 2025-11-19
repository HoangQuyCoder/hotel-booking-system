package com.example.backend.controller;

import com.example.backend.dto.filter.HotelFilterRequest;
import com.example.backend.dto.request.HotelRequest;
import com.example.backend.dto.request.HotelUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.HotelDetailResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    // CREATE HOTEL
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HotelDetailResponse>> createHotel(
            @Valid @RequestBody HotelRequest request) {

        HotelDetailResponse created = hotelService.createHotel(request);
        return ResponseEntity
                .status(201)
                .body(ApiResponse.success("Tạo khách sạn thành công!", created));
    }

    // GET HOTEL BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HotelDetailResponse>> getHotel(@PathVariable UUID id) {
        HotelDetailResponse hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy thông tin khách sạn thành công", hotel)
        );
    }

    // UPDATE HOTEL
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HotelDetailResponse>> updateHotel(
            @PathVariable UUID id,
            @Valid @RequestBody HotelUpdateRequest request) {

        HotelDetailResponse updated = hotelService.updateHotel(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Cập nhật khách sạn thành công", updated)
        );
    }

    // DELETE HOTEL
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable UUID id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Xóa khách sạn thành công")
        );
    }

    // GET ALL HOTELS (with pagination + filter)
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<HotelDetailResponse>>> getAllHotels(
            HotelFilterRequest filter) {

        PagedResponse<HotelDetailResponse> paged = hotelService.getAllHotels(filter);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách khách sạn thành công", paged)
        );
    }

    // SEARCH CITIES (autocomplete)
    @GetMapping("/cities")
    public ResponseEntity<ApiResponse<List<String>>> getCities(@RequestParam String q) {
        List<String> cities = hotelService.findDistinctCitiesContaining(q);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách thành phố thành công", cities)
        );
    }
}