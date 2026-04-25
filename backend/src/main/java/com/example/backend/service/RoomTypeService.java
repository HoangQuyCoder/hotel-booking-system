package com.example.backend.service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.filter.RoomTypeFilterRequest;
import com.example.backend.dto.request.RoomTypeRequest;
import com.example.backend.dto.request.RoomTypeUpdateRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomTypeListResponse;
import com.example.backend.dto.response.RoomTypeResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.RoomTypeMapper;
import com.example.backend.model.Hotel;
import com.example.backend.model.RoomType;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.specification.RoomTypeSpecification;
import com.example.backend.utils.PagingUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private static final Logger logger = LoggerFactory.getLogger(RoomTypeService.class);

    private final RoomTypeRepository roomTypeRepository;
    private final HotelRepository hotelRepository;
    private final RoomTypeMapper roomTypeMapper;

    @Transactional
    public RoomTypeResponse createRoomType(@NonNull RoomTypeRequest request) {
        logger.info("Creating room type with name: {} for hotel ID: {}", request.getName(), request.getHotelId());

        if (roomTypeRepository.existsByNameAndHotelId(request.getName(), request.getHotelId())) {
            logger.error("[create] Room type already exists: {} for hotel ID: {}", request.getName(),
                    request.getHotelId());
            throw new IllegalArgumentException("Room type already exists in this hotel");
        }

        Hotel hotel = hotelRepository.findById(Objects.requireNonNull(request.getHotelId()))
                .orElseThrow(() -> {
                    logger.error("[create] Hotel not found with ID: {}", request.getHotelId());
                    return new ResourceNotFoundException("Hotel not found");
                });

        RoomType roomType = roomTypeMapper.toEntity(request);
        roomType.setHotel(hotel);

        try {
            RoomType saved = roomTypeRepository.save(roomType);
            logger.info("Room type created successfully with ID: {}", saved.getId());
            return roomTypeMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create room type: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create room type", e);
        }
    }

    @Transactional
    public RoomTypeResponse getRoomTypeById(@NonNull UUID id) {
        logger.info("Fetching room type with ID: {}", id);

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Room type not found with ID: {}", id);
                    return new ResourceNotFoundException("Room type not found");
                });
        return roomTypeMapper.toResponse(roomType);
    }

    @Transactional
    public RoomTypeResponse updateRoomType(@NonNull UUID id, @Valid RoomTypeUpdateRequest request) {
        logger.info("Updating room type with ID: {}", id);

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Room type not found with ID: {}", id);
                    return new ResourceNotFoundException("Room type not found");
                });

        if (!roomType.getName().equals(request.getName())
                || !roomType.getHotel().getId().equals(request.getHotelId())) {
            if (roomTypeRepository.existsByNameAndHotelId(request.getName(), request.getHotelId())) {
                logger.error("[update] Room type already exists: {} for hotel ID: {}", request.getName(),
                        request.getHotelId());
                throw new IllegalArgumentException("Room type already exists in this hotel");
            }
        }

        Hotel hotel = hotelRepository.findById(Objects.requireNonNull(request.getHotelId()))
                .orElseThrow(() -> {
                    logger.error("[update] Hotel not found with ID: {}", request.getHotelId());
                    return new ResourceNotFoundException("Hotel not found");
                });

        roomTypeMapper.updateEntity(request, roomType);
        roomType.setHotel(hotel);

        try {
            RoomType updated = roomTypeRepository.save(roomType);
            logger.info("Room type updated successfully with ID: {}", id);
            return roomTypeMapper.toResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update room type: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update room type", e);
        }
    }

    @Transactional
    public RoomTypeResponse updateAvailability(@NonNull UUID id, boolean isAvailable) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found with id: " + id));

        roomType.setIsAvailable(isAvailable);
        roomTypeRepository.save(roomType);

        logger.info("RoomType {} availability updated to {}", id, isAvailable);

        return roomTypeMapper.toResponse(roomType);
    }

    @Transactional
    public void deleteRoomType(@NonNull UUID id) {
        logger.info("Deleting room type with ID: {}", id);

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Room type not found with ID: {}", id);
                    return new ResourceNotFoundException("Room type not found");
                });

        // Softly delete
        roomType.setIsActive(false);

        try {
            roomTypeRepository.save(roomType);
            logger.info("Room type deleted successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete room type: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete room type", e);
        }
    }

    @Transactional(readOnly = true)
    public PagedResponse<RoomTypeListResponse> getAllRoomTypes(RoomTypeFilterRequest filterRequest) {
        logger.info("Filtering room types with: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);
        Specification<RoomType> spec = RoomTypeSpecification.build(filterRequest);

        // Get data by page
        Page<RoomType> roomTypePage = roomTypeRepository.findAll(spec, Objects.requireNonNull(pageable));

        // Switch to DTO
        List<RoomTypeListResponse> content = roomTypePage.getContent()
                .stream()
                .map(roomTypeMapper::toListResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                roomTypePage.getNumber(),
                roomTypePage.getSize(),
                roomTypePage.getTotalElements(),
                roomTypePage.getTotalPages());
    }
}
