package com.example.backend.controller;

import com.example.backend.dto.filter.RoomAmenityFilterRequest;
import com.example.backend.dto.request.RoomAmenityRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomAmenityResponse;
import com.example.backend.service.RoomAmenityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/room-amenities")
public class RoomAmenityController {

        private final RoomAmenityService roomAmenityService;

        // CREATE
        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<RoomAmenityResponse>> createRoomAmenity(
                        @Valid @RequestBody @NonNull RoomAmenityRequest request) {

                RoomAmenityResponse created = roomAmenityService.createRoomAmenity(request);
                return ResponseEntity
                                .status(201)
                                .body(ApiResponse.success("Room widget created successfully!", created));
        }

        // GET BY ID
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<RoomAmenityResponse>> getRoomAmenity(@PathVariable @NonNull UUID id) {
                RoomAmenityResponse amenity = roomAmenityService.getRoomAmenityById(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Get utility information successfully", amenity));
        }

        // UPDATE
        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<RoomAmenityResponse>> updateRoomAmenity(
                        @PathVariable @NonNull UUID id,
                        @Valid @RequestBody @NonNull RoomAmenityRequest request) {

                RoomAmenityResponse updated = roomAmenityService.updateRoomAmenity(id, request);
                return ResponseEntity.ok(
                                ApiResponse.success("Room amenities updated successfully", updated));
        }

        // DELETE
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deleteRoomAmenity(@PathVariable @NonNull UUID id) {
                roomAmenityService.deleteRoomAmenity(id);
                return ResponseEntity.ok(
                                ApiResponse.ok("Room add-on deleted successfully"));
        }

        // GET ALL (pagination + filter)
        @GetMapping
        public ResponseEntity<ApiResponse<PagedResponse<RoomAmenityResponse>>> getAllRoomAmenities(
                        RoomAmenityFilterRequest filterRequest) {

                PagedResponse<RoomAmenityResponse> paged = roomAmenityService.getAllRoomAmenities(filterRequest);
                return ResponseEntity.ok(
                                ApiResponse.success("Get room amenities list successfully", paged));
        }
}