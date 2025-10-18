package com.example.backend.service;

import com.example.backend.dto.request.HotelRequest;
import com.example.backend.dto.request.HotelUpdateRequest;
import com.example.backend.dto.response.HotelResponse;
import com.example.backend.dto.response.ManagerResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Hotel;
import com.example.backend.model.User;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.specification.HotelSpecBuilder;
import com.example.backend.specification.HotelSpecification;
import com.example.backend.utils.BeanUtilsHelper;
import com.example.backend.utils.SpecUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class HotelService {

    private static final Logger logger = LoggerFactory.getLogger(HotelService.class);

    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;

    public HotelService(HotelRepository hotelRepository, UserRepository userRepository) {
        this.hotelRepository = hotelRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public HotelResponse createHotel(HotelRequest request) {
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
            return mapToResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create hotel: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create hotel", e);
        }
    }

    public HotelResponse getHotelById(UUID id) {
        logger.info("Fetching hotel with ID: {}", id);

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Hotel not found with ID: {}", id);
                    return new ResourceNotFoundException("Hotel not found");
                });
        return mapToResponse(hotel);
    }

    @Transactional
    public HotelResponse updateHotel(UUID id, HotelUpdateRequest request) {
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
            return mapToResponse(updated);
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
    public PagedResponse<HotelResponse> getAllHotels(
            int page,
            int size,
            String city,
            String name,
            String address,
            Double minRating,
            Double maxRating,
            Boolean isActive,
            LocalDateTime startDate,
            LocalDateTime endDate,
            UUID managerId,
            String sortBy,
            String sortDir
    ) {
        logger.info("Fetching hotels with filters (city={}, rating={}, createdAt={}–{})",
                city, maxRating, startDate, endDate);

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Hotel> spec = new HotelSpecBuilder()
                .city(city)
                .name(name)
                .address(address)
                .rating(minRating, maxRating)
                .isActive(isActive)
                .manager(managerId)
                .build();

        Page<Hotel> hotels = hotelRepository.findAll(spec, pageable);

        List<HotelResponse> content = hotels.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                hotels.getNumber(),
                hotels.getSize(),
                hotels.getTotalElements(),
                hotels.getTotalPages()
        );
    }

    public PagedResponse<HotelResponse> searchHotels(int page, int size, String keyword) {
        logger.info("Fetching hotels - page: {}, size: {}, keyword: {}", page, size, keyword);

        Pageable pageable = PageRequest.of(page, size);
        Specification<Hotel> spec = SpecUtils.empty();

        // Filter by keyword
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and(HotelSpecification.keywordContains(keyword));
            logger.debug("Filtering by keyword: {}", keyword);
        }

        // Execute query
        Page<Hotel> pageResult = hotelRepository.findAll(spec, pageable);
        logger.info("Found {} hotels (page {}/{})", pageResult.getNumberOfElements(), pageResult.getNumber() + 1, pageResult.getTotalPages());

        List<HotelResponse> content = pageResult.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }

    private HotelResponse mapToResponse(Hotel hotel) {
        HotelResponse response = new HotelResponse();
        response.setId(hotel.getId());
        response.setName(hotel.getName());
        response.setCity(hotel.getCity());
        response.setAddress(hotel.getAddress());
        response.setRating(hotel.getRating());
        response.setDescription(hotel.getDescription());
        response.setCreatedAt(hotel.getCreatedAt());
        response.setUpdatedAt(hotel.getUpdatedAt());
        response.setLatitude(hotel.getLatitude());
        response.setLongitude(hotel.getLongitude());
        response.setContactPhone(hotel.getContactPhone());
        response.setContactEmail(hotel.getContactEmail());
        response.setCheckInTime(hotel.getCheckInTime());
        response.setCheckOutTime(hotel.getCheckOutTime());
        response.setIsActive(hotel.getIsActive());

        if (hotel.getManager() != null) {
            ManagerResponse manager = new ManagerResponse();
            manager.setId(hotel.getManager().getId());
            manager.setUsername(hotel.getManager().getUsername());
            manager.setEmail(hotel.getManager().getEmail());
            manager.setFirstName(hotel.getManager().getFirstName());
            manager.setLastName(hotel.getManager().getLastName());
            response.setManager(manager);
        }

        return response;
    }
}