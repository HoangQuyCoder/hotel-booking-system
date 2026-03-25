package com.example.backend.controller;

import com.example.backend.dto.filter.RoomTypeFilterRequest;
import com.example.backend.dto.request.RoomTypeRequest;
import com.example.backend.dto.request.RoomTypeUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomTypeListResponse;
import com.example.backend.dto.response.RoomTypeResponse;
import com.example.backend.service.RoomTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/room-types")
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    // CREATE ROOM TYPE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> createRoomType(
            @Valid @RequestBody RoomTypeRequest request) {

        RoomTypeResponse created = roomTypeService.createRoomType(request);
        return ResponseEntity
                .status(201)
                .body(ApiResponse.success("Room type created successfully!", created));
    }

    // GET ROOM TYPE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> getRoomType(@PathVariable UUID id) {
        RoomTypeResponse roomType = roomTypeService.getRoomTypeById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Get room type information successfully", roomType)
        );
    }

    // UPDATE ROOM TYPE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> updateRoomType(
            @PathVariable UUID id,
            @Valid @RequestBody RoomTypeUpdateRequest request) {

        RoomTypeResponse updated = roomTypeService.updateRoomType(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Room type updated successfully", updated)
        );
    }

    // UPDATE AVAILABILITY (PATCH - enable/disable room type)
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> updateAvailability(
            @PathVariable UUID id,
            @RequestParam boolean isAvailable) {

        RoomTypeResponse updated = roomTypeService.updateAvailability(id, isAvailable);
        String message = isAvailable
                ? "Successful room sale"
                : "Suspend sale of room type successfully";

        return ResponseEntity.ok(
                ApiResponse.success(message, updated)
        );
    }

    // DELETE ROOM TYPE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRoomType(@PathVariable UUID id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Room type deleted successfully")
        );
    }

    // GET ALL ROOM TYPES (with pagination and filter)
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<RoomTypeListResponse>>> getAllRoomTypes(
            RoomTypeFilterRequest filterRequest) {

        PagedResponse<RoomTypeListResponse> paged = roomTypeService.getAllRoomTypes(filterRequest);
        return ResponseEntity.ok(
                ApiResponse.success("Get room type list successfully", paged)
        );
    }
}