package com.example.backend.service;

import com.example.backend.dto.filter.DailyOverrideFilterRequest;
import com.example.backend.dto.request.DailyOverrideRequest;
import com.example.backend.dto.response.DailyOverrideResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.DailyOverrideMapper;
import com.example.backend.model.DailyOverride;
import com.example.backend.model.RoomType;
import com.example.backend.repository.DailyOverrideRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.specification.DailyOverrideSpecification;
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
public class DailyOverrideService {

    private static final Logger logger = LoggerFactory.getLogger(DailyOverrideService.class);

    private final DailyOverrideRepository dailyOverrideRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final DailyOverrideMapper dailyOverrideMapper;

    @Transactional
    public DailyOverrideResponse createDailyOverride(DailyOverrideRequest request) {
        logger.info("Creating daily override for room type ID: {} on date: {}",
                request.getRoomTypeId(), request.getDate());

        if (dailyOverrideRepository.existsByRoomTypeIdAndDate(request.getRoomTypeId(), request.getDate())) {
            logger.error("[create] Daily override already exists for room type ID: {} on date: {}",
                    request.getRoomTypeId(), request.getDate());
            throw new IllegalArgumentException("Daily override already exists for this date");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> {
                    logger.error("[create] Room type not found with ID: {}", request.getRoomTypeId());
                    return new ResourceNotFoundException("Room type not found");
                });

        DailyOverride dailyOverride = dailyOverrideMapper.toEntity(request);
        dailyOverride.setRoomType(roomType);

        try {
            DailyOverride saved = dailyOverrideRepository.save(dailyOverride);
            logger.info("Daily override created successfully with ID: {}", saved.getId());
            return dailyOverrideMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create daily override: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create daily override", e);
        }
    }

    public DailyOverrideResponse getDailyOverrideById(UUID id) {
        logger.info("Fetching daily override with ID: {}", id);

        DailyOverride dailyOverride = dailyOverrideRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Daily override not found with ID: {}", id);
                    return new ResourceNotFoundException("Daily override not found");
                });
        return dailyOverrideMapper.toResponse(dailyOverride);
    }

    @Transactional
    public DailyOverrideResponse updateDailyOverride(UUID id, DailyOverrideRequest request) {
        logger.info("Updating daily override with ID: {}", id);

        DailyOverride dailyOverride = dailyOverrideRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Daily override not found with ID: {}", id);
                    return new ResourceNotFoundException("Daily override not found");
                });

        if (!dailyOverride.getRoomType().getId().equals(request.getRoomTypeId()) ||
                !dailyOverride.getDate().equals(request.getDate())) {
            if (dailyOverrideRepository.existsByRoomTypeIdAndDate(request.getRoomTypeId(), request.getDate())) {
                logger.error("[update] Daily override already exists for room type ID: {} on date: {}",
                        request.getRoomTypeId(), request.getDate());
                throw new IllegalArgumentException("Daily override already exists for this date");
            }
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> {
                    logger.error("[update] Room type not found with ID: {}", request.getRoomTypeId());
                    return new ResourceNotFoundException("Room type not found");
                });

        dailyOverrideMapper.updateEntityFromRequest(request, dailyOverride);
        dailyOverride.setRoomType(roomType);

        try {
            DailyOverride updated = dailyOverrideRepository.save(dailyOverride);
            logger.info("Daily override updated successfully with ID: {}", id);
            return dailyOverrideMapper.toResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update daily override: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update daily override", e);
        }
    }

    @Transactional
    public void deleteDailyOverride(UUID id) {
        logger.info("Deleting daily override with ID: {}", id);

        DailyOverride dailyOverride = dailyOverrideRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Daily override not found with ID: {}", id);
                    return new ResourceNotFoundException("Daily override not found");
                });

        try {
            dailyOverride.setIsActive(false);
            dailyOverrideRepository.save(dailyOverride);
            logger.info("Daily override deleted (soft) successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete daily override: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete daily override", e);
        }
    }

    @Transactional(readOnly = true)
    public PagedResponse<DailyOverrideResponse> getAllDailyOverrides(DailyOverrideFilterRequest filterRequest) {
        logger.info("Searching daily overrides with: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);

        Specification<DailyOverride> spec = DailyOverrideSpecification.build(filterRequest);

        Page<DailyOverride> pageResult = dailyOverrideRepository.findAll(spec, pageable);

        List<DailyOverrideResponse> content = pageResult.getContent()
                .stream()
                .map(dailyOverrideMapper::toResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }
}