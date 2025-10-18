package com.example.backend.controller;

import com.example.backend.dto.request.RoomTypeRequest;
import com.example.backend.dto.request.RoomTypeUpdateRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomTypeResponse;
import com.example.backend.service.RoomTypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/room-types")
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    public RoomTypeController(RoomTypeService roomTypeService) {
        this.roomTypeService = roomTypeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomTypeResponse> createRoomType(@Valid @RequestBody RoomTypeRequest request) {
        return new ResponseEntity<>(roomTypeService.createRoomType(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomTypeResponse> getRoomType(@PathVariable UUID id) {
        return ResponseEntity.ok(roomTypeService.getRoomTypeById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomTypeResponse> updateRoomType(@PathVariable UUID id, @Valid @RequestBody RoomTypeUpdateRequest request) {
        return ResponseEntity.ok(roomTypeService.updateRoomType(id, request));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomTypeResponse> updateAvailability(
            @PathVariable UUID id,
            @RequestParam boolean isAvailable) {

        RoomTypeResponse response = roomTypeService.updateAvailability(id, isAvailable);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoomType(@PathVariable UUID id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PagedResponse<RoomTypeResponse>> filterRoomTypes(
            @RequestParam(required = false) UUID hotelId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) Boolean isAvailable,
            @RequestParam(required = false) Integer minSize,
            @RequestParam(required = false) Integer maxSize,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(roomTypeService.findRoomTypes(
                hotelId, name, capacity, isAvailable,
                minSize, maxSize, page, size, sortBy, sortDir));
    }
}
