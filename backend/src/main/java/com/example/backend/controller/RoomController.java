package com.example.backend.controller;

import com.example.backend.dto.filter.RoomFilterRequest;
import com.example.backend.dto.request.RoomRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomResponse;
import com.example.backend.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rooms")
public class RoomController {

        private final RoomService roomService;

        // CREATE ROOM
        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<RoomResponse>> createRoom(
                        @Valid @RequestBody @NonNull RoomRequest request) {

                RoomResponse created = roomService.createRoom(request);
                return ResponseEntity
                                .status(201)
                                .body(ApiResponse.success("Room created successfully!", created));
        }

        // GET ROOM BY ID
        @GetMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
        public ResponseEntity<ApiResponse<RoomResponse>> getRoom(@PathVariable @NonNull UUID id) {
                RoomResponse room = roomService.getRoomById(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Room information successfully retrieved", room));
        }

        // UPDATE ROOM
        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
        public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
                        @PathVariable @NonNull UUID id,
                        @Valid @RequestBody @NonNull RoomRequest request) {

                RoomResponse updated = roomService.updateRoom(id, request);
                return ResponseEntity.ok(
                                ApiResponse.success("Room information updated successfully", updated));
        }

        // DELETE ROOM
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable @NonNull UUID id) {
                roomService.deleteRoom(id);
                return ResponseEntity.ok(
                                ApiResponse.ok("Room deleted successfully"));
        }

        // GET ALL ROOMS (with pagination and filter)
        @GetMapping
        @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
        public ResponseEntity<ApiResponse<PagedResponse<RoomResponse>>> getAllRooms(
                        RoomFilterRequest filterRequest) {

                PagedResponse<RoomResponse> paged = roomService.getAllRooms(filterRequest);
                return ResponseEntity.ok(
                                ApiResponse.success("Get room list successfully", paged));
        }
}