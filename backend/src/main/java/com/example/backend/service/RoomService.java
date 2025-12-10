package com.example.backend.service;

import com.example.backend.common.RoomStatus;
import com.example.backend.dto.filter.RoomFilterRequest;
import com.example.backend.dto.request.RoomRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.RoomMapper;
import com.example.backend.model.Room;
import com.example.backend.model.RoomType;
import com.example.backend.repository.RoomRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.specification.RoomSpecification;
import com.example.backend.utils.PagingUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private static final Logger logger = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomMapper roomMapper;

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

        RoomStatus status = RoomStatus.valueOf(request.getStatus());
        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .status(status)
                .roomType(roomType)
                .isActive(true)
                .build();

        try {
            Room saved = roomRepository.save(room);
            logger.info("Room created successfully with ID: {}", saved.getId());
            return roomMapper.toResponse(saved);
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
        return roomMapper.toResponse(room);
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
            return roomMapper.toResponse(updated);
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
    public PagedResponse<RoomResponse> getAllRooms(RoomFilterRequest filterRequest) {
        logger.info("Searching rooms with: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);

        Specification<Room> spec = RoomSpecification.build(filterRequest);

        Page<Room> roomPage = roomRepository.findAll(spec, pageable);

        List<RoomResponse> content = roomPage.getContent()
                .stream()
                .map(roomMapper::toResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                roomPage.getNumber(),
                roomPage.getSize(),
                roomPage.getTotalElements(),
                roomPage.getTotalPages()
        );
    }
}