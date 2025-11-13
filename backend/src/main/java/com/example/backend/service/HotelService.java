package com.example.backend.service;

import com.example.backend.dto.filter.HotelFilterRequest;
import com.example.backend.dto.request.HotelRequest;
import com.example.backend.dto.request.HotelUpdateRequest;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.HotelMapper;
import com.example.backend.model.Hotel;
import com.example.backend.model.User;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.specification.HotelSpecification;
import com.example.backend.utils.BeanUtilsHelper;
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
public class HotelService {

    private static final Logger logger = LoggerFactory.getLogger(HotelService.class);

    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final HotelMapper hotelMapper;

    @Transactional
    public HotelDetailResponse createHotel(HotelRequest request) {
        User user = null;
        logger.info("Creating hotel with name: {} in city: {}", request.getName(), request.getCity());

        if (hotelRepository.existsByNameAndCity(request.getName(), request.getCity())) {
            logger.error("[create] Hotel already exists: {} in {}", request.getName(), request.getCity());
            throw new IllegalArgumentException("Hotel already exists in this city");
        }

        if (request.getManagerId() != null) {
            user = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> {
                        logger.error("Manager not found with ID: {}", request.getManagerId());
                        return new ResourceNotFoundException("Role not found");
                    });
        }
        
        Hotel hotel = Hotel.builder()
                .name(request.getName())
                .city(request.getCity())
                .address(request.getAddress())
                .rating(request.getRating())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .images(request.getImages())
                .manager(user)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .contactPhone(request.getContactPhone())
                .contactEmail(request.getContactEmail())
                .checkInTime(request.getCheckInTime())
                .checkOutTime(request.getCheckOutTime())
                .isActive(true)
                .build();

        try {
            Hotel saved = hotelRepository.save(hotel);
            logger.info("Hotel created successfully with ID: {}", saved.getId());
            return hotelMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create hotel: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create hotel", e);
        }
    }

    public HotelDetailResponse getHotelById(UUID id) {
        logger.info("Fetching hotel with ID: {}", id);

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Hotel not found with ID: {}", id);
                    return new ResourceNotFoundException("Hotel not found");
                });
        return hotelMapper.toResponse(hotel);
    }

    @Transactional
    public HotelDetailResponse updateHotel(UUID id, HotelUpdateRequest request) {
        logger.info("Updating hotel with ID: {}", id);

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Hotel not found with ID: {}", id);
                    return new ResourceNotFoundException("Hotel not found");
                });

        if (!hotel.getName().equals(request.getName()) || !hotel.getCity().equals(request.getCity())) {
            if (hotelRepository.existsByNameAndCity(request.getName(), request.getCity())) {
                logger.error("[update] Hotel already exists: {} in {}", request.getName(), request.getCity());
                throw new IllegalArgumentException("Hotel already exists in this city");
            }
        }

        if (request.getManagerId() != null && !userRepository.existsById(request.getManagerId())) {
            logger.error("[update] Manager not found with ID: {}", request.getManagerId());
            throw new ResourceNotFoundException("Manager not found");
        }

        // Update fields only when data is available
        BeanUtilsHelper.copyNonNullProperties(request, hotel);

        try {
            Hotel updated = hotelRepository.save(hotel);
            logger.info("Hotel updated successfully with ID: {}", id);
            return hotelMapper.toResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update hotel: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update hotel", e);
        }
    }

    @Transactional
    public void deleteHotel(UUID id) {
        logger.info("Deleting hotel with ID: {}", id);

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[delete] Hotel not found with ID: {}", id);
                    return new ResourceNotFoundException("Hotel not found");
                });

        // Softly delete
        hotel.setIsActive(false);
        try {
            hotelRepository.save(hotel);
            logger.info("Hotel deleted (soft) successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete hotel: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete hotel", e);
        }
    }

    @Transactional(readOnly = true)
    public PagedResponse<HotelDetailResponse> getAllHotels(HotelFilterRequest filterRequest) {
        logger.info("Fetching hotels with filters: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);

        Specification<Hotel> spec = HotelSpecification.build(filterRequest);

        Page<Hotel> hotels = hotelRepository.findAll(spec, pageable);

        List<HotelDetailResponse> content = hotels.getContent().stream()
                .map(hotelMapper::toResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                hotels.getNumber(),
                hotels.getSize(),
                hotels.getTotalElements(),
                hotels.getTotalPages()
        );
    }

    public List<String> findDistinctCitiesContaining(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        return hotelRepository.findDistinctCitiesContainingIgnoreCase(keyword.trim());
    }
}