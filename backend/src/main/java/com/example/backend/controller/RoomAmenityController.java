package com.example.backend.controller;

import com.example.backend.dto.filter.RoomAmenityFilterRequest;
import com.example.backend.dto.request.RoomAmenityRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomAmenityResponse;
import com.example.backend.service.RoomAmenityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/room-amenities")
public class RoomAmenityController {

    private final RoomAmenityService roomAmenityService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomAmenityResponse> createRoomAmenity(@Valid @RequestBody RoomAmenityRequest request) {
        return new ResponseEntity<>(roomAmenityService.createRoomAmenity(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomAmenityResponse> getRoomAmenity(@PathVariable UUID id) {
        return ResponseEntity.ok(roomAmenityService.getRoomAmenityById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomAmenityResponse> updateRoomAmenity(@PathVariable UUID id, @Valid @RequestBody RoomAmenityRequest request) {
        return ResponseEntity.ok(roomAmenityService.updateRoomAmenity(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoomAmenity(@PathVariable UUID id) {
        roomAmenityService.deleteRoomAmenity(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PagedResponse<RoomAmenityResponse>> getAllRoomAmenities(RoomAmenityFilterRequest filterRequest) {
        return ResponseEntity.ok(roomAmenityService.getAllRoomAmenities(filterRequest));
    }
}
