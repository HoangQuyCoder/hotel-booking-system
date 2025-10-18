package com.example.backend.service;

import com.example.backend.dto.request.RoomTypeRequest;
import com.example.backend.dto.request.RoomTypeUpdateRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.RoomTypeResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Hotel;
import com.example.backend.model.RoomType;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.specification.RoomTypeSpecBuilder;
import com.example.backend.utils.BeanUtilsHelper;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomTypeService {

    private static final Logger logger = LoggerFactory.getLogger(RoomTypeService.class);

    private final RoomTypeRepository roomTypeRepository;
    private final HotelRepository hotelRepository;

    public RoomTypeService(RoomTypeRepository roomTypeRepository, HotelRepository hotelRepository) {
        this.roomTypeRepository = roomTypeRepository;
        this.hotelRepository = hotelRepository;
    }

    @Transactional
    public RoomTypeResponse createRoomType(RoomTypeRequest request) {
        logger.info("Creating room type with name: {} for hotel ID: {}", request.getName(), request.getHotelId());

        if (roomTypeRepository.existsByNameAndHotelId(request.getName(), request.getHotelId())) {
            logger.error("[create] Room type already exists: {} for hotel ID: {}", request.getName(), request.getHotelId());
            throw new IllegalArgumentException("Room type already exists in this hotel");
        }

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> {
                    logger.error("[create] Hotel not found with ID: {}", request.getHotelId());
                    return new ResourceNotFoundException("Hotel not found");
                });

        RoomType roomType = RoomType.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .sizeSqm(request.getSizeSqm())
                .totalRooms(request.getTotalRooms())
                .description(request.getDescription())
                .hotel(hotel)
                .isAvailable(true)
                .build();

        try {
            RoomType saved = roomTypeRepository.save(roomType);
            logger.info("Room type created successfully with ID: {}", saved.getId());
            return mapToResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create room type: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create room type", e);
        }
    }

    public RoomTypeResponse getRoomTypeById(UUID id) {
        logger.info("Fetching room type with ID: {}", id);

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Room type not found with ID: {}", id);
                    return new ResourceNotFoundException("Room type not found");
                });
        return mapToResponse(roomType);
    }

    @Transactional
    public RoomTypeResponse updateRoomType(UUID id, @Valid RoomTypeUpdateRequest request) {
        logger.info("Updating room type with ID: {}", id);

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Room type not found with ID: {}", id);
                    return new ResourceNotFoundException("Room type not found");
                });

        if (!roomType.getName().equals(request.getName()) || !roomType.getHotel().getId().equals(request.getHotelId())) {
            if (roomTypeRepository.existsByNameAndHotelId(request.getName(), request.getHotelId())) {
                logger.error("[update] Room type already exists: {} for hotel ID: {}", request.getName(), request.getHotelId());
                throw new IllegalArgumentException("Room type already exists in this hotel");
            }
        }

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> {
                    logger.error("[update] Hotel not found with ID: {}", request.getHotelId());
                    return new ResourceNotFoundException("Hotel not found");
                });

        // Update fields only when data is available
        BeanUtilsHelper.copyNonNullProperties(request, roomType);
        roomType.setHotel(hotel);

        try {
            RoomType updated = roomTypeRepository.save(roomType);
            logger.info("Room type updated successfully with ID: {}", id);
            return mapToResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update room type: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update room type", e);
        }
    }

    @Transactional
    public RoomTypeResponse updateAvailability(UUID id, boolean isAvailable) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found with id: " + id));

        roomType.setIsAvailable(isAvailable);
        roomTypeRepository.save(roomType);

        logger.info("RoomType {} availability updated to {}", id, isAvailable);

        return mapToResponse(roomType);
    }

    @Transactional
    public void deleteRoomType(UUID id) {
        logger.info("Deleting room type with ID: {}", id);

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Room type not found with ID: {}", id);
                    return new ResourceNotFoundException("Room type not found");
                });

        // Softly delete
        roomType.setIsActive(false);

        if (!roomType.getRooms().isEmpty() || !roomType.getBookingRooms().isEmpty()) {
            logger.error("Cannot delete room type with associated rooms or bookings");
            throw new IllegalStateException("Cannot delete room type with associated rooms or bookings");
        }

        try {
            roomTypeRepository.save(roomType);
            logger.info("Room type deleted successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete room type: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete room type", e);
        }
    }

    public PagedResponse<RoomTypeResponse> findRoomTypes(
            UUID hotelId,
            String name,
            Integer capacity,
            Boolean isAvailable,
            Integer minSize,
            Integer maxSize,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        logger.info("Filtering room types with pagination...");

        // Create dynamic specifications
        Specification<RoomType> spec = new RoomTypeSpecBuilder()
                .withHotelId(hotelId)
                .withName(name)
                .withCapacity(capacity)
                .withAvailability(isAvailable)
                .withMinSize(minSize)
                .withMaxSize(maxSize)
                .build();

        // Set up sorting
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // Get data by page
        Page<RoomType> roomTypePage = roomTypeRepository.findAll(spec, pageable);

        // Switch to DTO
        List<RoomTypeResponse> content = roomTypePage.getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                roomTypePage.getNumber(),
                roomTypePage.getSize(),
                roomTypePage.getTotalElements(),
                roomTypePage.getTotalPages()
        );
    }

    private RoomTypeResponse mapToResponse(RoomType roomType) {
        RoomTypeResponse response = new RoomTypeResponse();
        response.setId(roomType.getId());
        response.setName(roomType.getName());
        response.setCapacity(roomType.getCapacity());
        response.setSizeSqm(roomType.getSizeSqm());
        response.setTotalRooms(roomType.getTotalRooms());
        response.setDescription(roomType.getDescription());
        response.setCreatedAt(roomType.getCreatedAt());
        response.setUpdatedAt(roomType.getUpdatedAt());
        response.setIsAvailable(roomType.getIsAvailable());
        response.setIsActive(roomType.getIsActive());
        response.setHotelId(roomType.getHotel().getId());
        return response;
    }
}
