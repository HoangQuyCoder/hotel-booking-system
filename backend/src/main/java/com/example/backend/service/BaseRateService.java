package com.example.backend.service;

import com.example.backend.dto.filter.BaseRateFilterRequest;
import com.example.backend.dto.request.BaseRateRequest;
import com.example.backend.dto.response.BaseRateResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.BaseRateMapper;
import com.example.backend.model.BaseRate;
import com.example.backend.model.RoomType;
import com.example.backend.repository.BaseRateRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.specification.BaseRateSpecification;
import com.example.backend.utils.PagingUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BaseRateService {

    private static final Logger logger = LoggerFactory.getLogger(BaseRateService.class);

    private final BaseRateRepository baseRateRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BaseRateMapper baseRateMapper;

    @Transactional
    public BaseRateResponse createBaseRate(BaseRateRequest request) {
        logger.info("Creating base rate for room type ID: {} from {} to {}",
                request.getRoomTypeId(), request.getStartDate(), request.getEndDate());

        if (request.getEndDate().isBefore(request.getStartDate())) {
            logger.error("[create] End date {} is before start date {}", request.getEndDate(), request.getStartDate());
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        RoomType roomType = roomTypeRepository.findById(Objects.requireNonNull(request.getRoomTypeId()))
                .orElseThrow(() -> {
                    logger.error("[create] Room type not found with ID: {}", request.getRoomTypeId());
                    return new ResourceNotFoundException("Room type not found");
                });

        if (baseRateRepository.existsByRoomTypeIdAndOverlappingDates(
                request.getRoomTypeId(), request.getStartDate(), request.getEndDate())) {
            logger.error("[create] Overlapping base rate exists for room type ID: {} between {} and {}",
                    request.getRoomTypeId(), request.getStartDate(), request.getEndDate());
            throw new IllegalArgumentException("Overlapping base rate exists for this period");
        }

        BaseRate baseRate = baseRateMapper.toEntity(request);
        baseRate.setRoomType(roomType);

        try {
            BaseRate saved = baseRateRepository.save(baseRate);
            logger.info("Base rate created successfully with ID: {}", saved.getId());
            return baseRateMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create base rate: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create base rate", e);
        }
    }

    @Transactional
    public BaseRateResponse getBaseRateById(@NonNull UUID id) {
        logger.info("Fetching base rate with ID: {}", id);

        BaseRate baseRate = baseRateRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Base rate not found with ID: {}", id);
                    return new ResourceNotFoundException("Base rate not found");
                });
        return baseRateMapper.toResponse(baseRate);
    }

    @Transactional
    public BaseRateResponse updateBaseRate(@NonNull UUID id, BaseRateRequest request) {
        logger.info("Updating base rate with ID: {}", id);

        BaseRate baseRate = baseRateRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Base rate not found with ID: {}", id);
                    return new ResourceNotFoundException("Base rate not found");
                });

        if (request.getEndDate().isBefore(request.getStartDate())) {
            logger.error("[update] End date {} is before start date {}", request.getEndDate(), request.getStartDate());
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        RoomType roomType = roomTypeRepository.findById(Objects.requireNonNull(request.getRoomTypeId()))
                .orElseThrow(() -> {
                    logger.error("[update] Room type not found with ID: {}", request.getRoomTypeId());
                    return new ResourceNotFoundException("Room type not found");
                });

        if (!baseRate.getRoomType().getId().equals(request.getRoomTypeId()) ||
                !baseRate.getStartDate().equals(request.getStartDate()) ||
                !baseRate.getEndDate().equals(request.getEndDate())) {
            if (baseRateRepository.existsByRoomTypeIdAndOverlappingDates(
                    request.getRoomTypeId(), request.getStartDate(), request.getEndDate())) {
                logger.error("[update] Overlapping base rate exists for room type ID: {} between {} and {}",
                        request.getRoomTypeId(), request.getStartDate(), request.getEndDate());
                throw new IllegalArgumentException("Overlapping base rate exists for this period");
            }
        }

        baseRateMapper.updateEntity(request, baseRate);
        baseRate.setRoomType(roomType);

        try {
            BaseRate updated = baseRateRepository.save(baseRate);
            logger.info("Base rate updated successfully with ID: {}", id);
            return baseRateMapper.toResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update base rate: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update base rate", e);
        }
    }

    @Transactional
    public void deleteBaseRate(@NonNull UUID id) {
        logger.info("Deleting base rate with ID: {}", id);

        BaseRate baseRate = baseRateRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[delete] Base rate not found with ID: {}", id);
                    return new ResourceNotFoundException("Base rate not found");
                });

        try {
            baseRate.setIsActive(false);
            baseRateRepository.save(baseRate);
            logger.info("Base rate deleted (soft) successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete base rate: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete base rate", e);
        }
    }

    @Transactional
    public PagedResponse<BaseRateResponse> getAllBaseRates(BaseRateFilterRequest filterRequest) {
        logger.info("Filtering BaseRates with request: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);

        Specification<BaseRate> spec = BaseRateSpecification.build(filterRequest);

        Page<BaseRate> pageResult = baseRateRepository.findAll(spec, Objects.requireNonNull(pageable));

        List<BaseRateResponse> content = pageResult.getContent()
                .stream()
                .map(baseRateMapper::toResponse)
                .toList();

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages());
    }
}
