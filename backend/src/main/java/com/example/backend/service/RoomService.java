package com.example.backend.service;

import com.example.backend.dto.request.RoomRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Room;
import com.example.backend.common.RoomStatus;
import com.example.backend.model.RoomType;
import com.example.backend.repository.RoomRepository;
import com.example.backend.repository.RoomTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private static final Logger logger = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    public RoomService(RoomRepository roomRepository, RoomTypeRepository roomTypeRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        logger.info("Creating room with number: {} for room type ID: {}", request.getRoomNumber(), request.getRoomTypeId());

        if (roomRepository.existsByRoomNumberAndRoomTypeId(request.getRoomNumber(), request.getRoomTypeId())) {
            logger.error("[create] Room number already exists: {} for room type ID: {}", request.getRoomNumber(), request.getRoomTypeId());
            throw new IllegalArgumentException("Room number already exists for this room type");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> {
                    logger.error("[create] Room type not found with ID: {}", request.getRoomTypeId());
                    return new ResourceNotFoundException("Room type not found");
                });

        try {
            RoomStatus status = RoomStatus.valueOf(request.getStatus());
            Room room = Room.builder()
                    .roomNumber(request.getRoomNumber())
                    .status(status)
                    .roomType(roomType)
                    .isActive(true)
                    .build();

            Room saved = roomRepository.save(room);
            logger.info("Room created successfully with ID: {}", saved.getId());
            return mapToResponse(saved);
        } catch (IllegalArgumentException e) {
            logger.error("[create] Invalid room status: {}", request.getStatus());
            throw new IllegalArgumentException("Invalid room status: " + request.getStatus());
        } catch (Exception e) {
            logger.error("Failed to create room: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create room", e);
        }
    }

    public RoomResponse getRoomById(UUID id) {
        logger.info("Fetching room with ID: {}", id);

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Room not found with ID: {}", id);
                    return new ResourceNotFoundException("Room not found");
                });
        return mapToResponse(room);
    }

    @Transactional
    public RoomResponse updateRoom(UUID id, RoomRequest request) {
        logger.info("Updating room with ID: {}", id);

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Room not found with ID: {}", id);
                    return new ResourceNotFoundException("Room not found");
                });

        if (!room.getRoomNumber().equals(request.getRoomNumber()) || !room.getRoomType().getId().equals(request.getRoomTypeId())) {
            if (roomRepository.existsByRoomNumberAndRoomTypeId(request.getRoomNumber(), request.getRoomTypeId())) {
                logger.error("[update] Room number already exists: {} for room type ID: {}", request.getRoomNumber(), request.getRoomTypeId());
                throw new IllegalArgumentException("Room number already exists for this room type");
            }
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> {
                    logger.error("[update] Room type not found with ID: {}", request.getRoomTypeId());
                    return new ResourceNotFoundException("Room type not found");
                });

        try {
            RoomStatus status = RoomStatus.valueOf(request.getStatus());
            room.setRoomNumber(request.getRoomNumber());
            room.setStatus(status);
            room.setRoomType(roomType);

            Room updated = roomRepository.save(room);
            logger.info("Room updated successfully with ID: {}", id);
            return mapToResponse(updated);
        } catch (IllegalArgumentException e) {
            logger.error("[update] Invalid room status: {}", request.getStatus());
            throw new IllegalArgumentException("Invalid room status: " + request.getStatus());
        } catch (Exception e) {
            logger.error("Failed to update room: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update room", e);
        }
    }

    @Transactional
    public void deleteRoom(UUID id) {
        logger.info("Deleting room with ID: {}", id);

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Room not found with ID: {}", id);
                    return new ResourceNotFoundException("Room not found");
                });

        try {
            room.setIsActive(false);
            roomRepository.save(room);
            logger.info("Room deleted successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete room: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete room", e);
        }
    }

    @Transactional(readOnly = true)
    public PagedResponse<RoomResponse> findRooms(
            UUID roomTypeId,
            String status,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        logger.info("Searching rooms with roomTypeId: {} and status: {}", roomTypeId, status);

        RoomStatus roomStatus = null;
        if (status != null) {
            try {
                roomStatus = RoomStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                logger.error("Invalid room status: {}", status);
                throw new IllegalArgumentException("Invalid room status: " + status);
            }
        }

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Room> roomPage = roomRepository.findByFilters(roomTypeId, roomStatus, pageable);

        List<RoomResponse> content = roomPage.getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                roomPage.getNumber(),
                roomPage.getSize(),
                roomPage.getTotalElements(),
                roomPage.getTotalPages()
        );
    }

    private RoomResponse mapToResponse(Room room) {
        RoomResponse response = new RoomResponse();
        response.setId(room.getId());
        response.setRoomNumber(room.getRoomNumber());
        response.setStatus(room.getStatus().name());
        response.setIsActive(room.getIsActive());
        response.setCreatedAt(room.getCreatedAt());
        response.setUpdatedAt(room.getUpdatedAt());
        response.setRoomTypeId(room.getRoomType().getId());
        return response;
    }
}