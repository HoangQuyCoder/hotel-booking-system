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
import com.example.backend.utils.PagingUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
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

        Hotel hotel = hotelMapper.toEntity(request);
        hotel.setManager(user);

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

        hotelMapper.updateEntity(request, hotel);

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
    public PagedResponse<HotelListResponse> getAllHotels(HotelFilterRequest filterRequest) {
        logger.info("Fetching hotels with filters: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);

        Specification<Hotel> spec = HotelSpecification.build(filterRequest);

        Page<Hotel> hotels = hotelRepository.findAll(spec, pageable);

        List<HotelListResponse> content = hotels.getContent().stream()
                .map(hotelMapper::toListResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                hotels.getNumber(),
                hotels.getSize(),
                hotels.getTotalElements(),
                hotels.getTotalPages());
    }

    public List<String> findDistinctCitiesContaining(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        return hotelRepository.findDistinctCitiesContainingIgnoreCase(keyword.trim());
    }

    public List<HotelListResponse> getFeaturedHotels() {
        // Featured = rating cao + active
        return hotelRepository.findTop10ByIsActiveTrueOrderByRatingDesc()
                .stream()
                .map(hotelMapper::toListResponse)
                .toList();
    }

    public List<HotelListResponse> getTopRatedHotels() {
        return hotelRepository.findTop10ByIsActiveTrueOrderByRatingDesc()
                .stream()
                .map(hotelMapper::toListResponse)
                .toList();
    }

    public List<HotelListResponse> getNewestHotels() {
        return hotelRepository.findTop10ByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(hotelMapper::toListResponse)
                .toList();
    }

    public List<HotelListResponse> getHotelsByCity(String city) {
        return hotelRepository.findTop10ByCityAndIsActiveTrueOrderByRatingDesc(city)
                .stream()
                .map(hotelMapper::toListResponse)
                .toList();
    }

    public List<HotelListResponse> getNearbyHotels(Double lat, Double lng) {
        List<Hotel> hotels = hotelRepository.findAll();

        return hotels.stream()
                .filter(h -> h.getLatitude() != null && h.getLongitude() != null)
                .sorted(Comparator.comparingDouble(h -> distance(lat, lng, h.getLatitude(), h.getLongitude())))
                .limit(10)
                .map(hotelMapper::toListResponse)
                .toList();
    }

    // Haversine formula
    private double distance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}