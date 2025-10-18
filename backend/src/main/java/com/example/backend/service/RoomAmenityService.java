package com.example.backend.service;

import com.example.backend.dto.request.RoomAmenityRequest;
import com.example.backend.dto.response.RoomAmenityResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.RoomAmenity;
import com.example.backend.model.RoomType;
import com.example.backend.repository.RoomAmenityRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.utils.BeanUtilsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomAmenityService {

    private static final Logger logger = LoggerFactory.getLogger(RoomAmenityService.class);

    private final RoomAmenityRepository roomAmenityRepository;
    private final RoomTypeRepository roomTypeRepository;

    public RoomAmenityService(RoomAmenityRepository roomAmenityRepository, RoomTypeRepository roomTypeRepository) {
        this.roomAmenityRepository = roomAmenityRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    @Transactional
    public RoomAmenityResponse createRoomAmenity(RoomAmenityRequest request) {
        logger.info("Creating room amenity with name: {} for room type ID: {}", request.getName(), request.getRoomTypeId());

        if (roomAmenityRepository.existsByNameAndRoomTypeId(request.getName(), request.getRoomTypeId())) {
            logger.error("[create] Room amenity already exists: {} for room type ID: {}", request.getName(), request.getRoomTypeId());
            throw new IllegalArgumentException("Room amenity already exists for this room type");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> {
                    logger.error("[create] Room type not found with ID: {}", request.getRoomTypeId());
                    return new ResourceNotFoundException("Room type not found");
                });

        RoomAmenity roomAmenity = RoomAmenity.builder()
                .name(request.getName())
                .category(request.getCategory())
                .roomType(roomType)
                .isActive(true)
                .build();

        try {
            RoomAmenity saved = roomAmenityRepository.save(roomAmenity);
            logger.info("Room amenity created successfully with ID: {}", saved.getId());
            return mapToResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create room amenity: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create room amenity", e);
        }
    }

    public RoomAmenityResponse getRoomAmenityById(UUID id) {
        logger.info("Fetching room amenity with ID: {}", id);

        RoomAmenity roomAmenity = roomAmenityRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Room amenity not found with ID: {}", id);
                    return new ResourceNotFoundException("Room amenity not found");
                });
        return mapToResponse(roomAmenity);
    }

    @Transactional
    public RoomAmenityResponse updateRoomAmenity(UUID id, RoomAmenityRequest request) {
        logger.info("Updating room amenity with ID: {}", id);

        RoomAmenity roomAmenity = roomAmenityRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Room amenity not found with ID: {}", id);
                    return new ResourceNotFoundException("Room amenity not found");
                });

        if (!roomAmenity.getName().equals(request.getName()) || !roomAmenity.getRoomType().getId().equals(request.getRoomTypeId())) {
            if (roomAmenityRepository.existsByNameAndRoomTypeId(request.getName(), request.getRoomTypeId())) {
                logger.error("[update] Room amenity already exists: {} for room type ID: {}", request.getName(), request.getRoomTypeId());
                throw new IllegalArgumentException("Room amenity already exists for this room type");
            }
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> {
                    logger.error("[update] Room type not found with ID: {}", request.getRoomTypeId());
                    return new ResourceNotFoundException("Room type not found");
                });

        BeanUtilsHelper.copyNonNullProperties(request, roomAmenity);
        roomAmenity.setRoomType(roomType);

        try {
            RoomAmenity updated = roomAmenityRepository.save(roomAmenity);
            logger.info("Room amenity updated successfully with ID: {}", id);
            return mapToResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update room amenity: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update room amenity", e);
        }
    }

    @Transactional
    public void deleteRoomAmenity(UUID id) {
        logger.info("Deleting room amenity with ID: {}", id);

        RoomAmenity roomAmenity = roomAmenityRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Room amenity not found with ID: {}", id);
                    return new ResourceNotFoundException("Room amenity not found");
                });

        try {
            roomAmenity.setIsActive(false);
            roomAmenityRepository.save(roomAmenity);
            logger.info("Room amenity deleted (soft) successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete room amenity: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete room amenity", e);
        }
    }

    @Transactional(readOnly = true)
    public List<RoomAmenityResponse> findRoomAmenities(UUID roomTypeId, String category) {
        logger.info("Searching room amenities with roomTypeId: {} and category: {}", roomTypeId, category);

        List<RoomAmenity> roomAmenities = roomAmenityRepository.findByFilters(roomTypeId, category);
        return roomAmenities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RoomAmenityResponse mapToResponse(RoomAmenity roomAmenity) {
        RoomAmenityResponse response = new RoomAmenityResponse();
        response.setId(roomAmenity.getId());
        response.setName(roomAmenity.getName());
        response.setCategory(roomAmenity.getCategory());
        response.setIsActive(roomAmenity.getIsActive());
        response.setRoomTypeId(roomAmenity.getRoomType().getId());
        return response;
    }
}
