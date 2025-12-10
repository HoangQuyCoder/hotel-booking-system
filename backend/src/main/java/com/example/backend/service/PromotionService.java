package com.example.backend.service;

import com.example.backend.dto.filter.PromotionFilterRequest;
import com.example.backend.dto.request.PromotionRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.PromotionResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.PromotionMapper;
import com.example.backend.model.Promotion;
import com.example.backend.repository.PromotionRepository;
import com.example.backend.specification.PromotionSpecification;
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

@Service
@RequiredArgsConstructor
public class PromotionService {

    private static final Logger logger = LoggerFactory.getLogger(PromotionService.class);

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        logger.info("Creating promotion with code: {}", request.getCode());

        if (promotionRepository.existsByCode(request.getCode())) {
            logger.error("[create] Promotion code already exists: {}", request.getCode());
            throw new IllegalArgumentException("Promotion code already exists");
        }

        if (request.getValidTo().isBefore(request.getValidFrom())) {
            logger.error("[create] Valid to {} is before valid from {}", request.getValidTo(), request.getValidFrom());
            throw new IllegalArgumentException("Valid to cannot be before valid from");
        }

        if (request.getMaxUses() != null && request.getMaxUses() <= 0) {
            logger.error("[create] Max uses must be positive: {}", request.getMaxUses());
            throw new IllegalArgumentException("Max uses must be positive");
        }

        Promotion promotion = Promotion.builder()
                .code(request.getCode())
                .discountPercent(request.getDiscountPercent())
                .validFrom(request.getValidFrom())
                .validTo(request.getValidTo())
                .maxUses(request.getMaxUses())
                .minBookingAmount(request.getMinBookingAmount())
                .usedCount(0)
                .build();

        try {
            Promotion saved = promotionRepository.save(promotion);
            logger.info("Promotion created successfully with ID: {}", saved.getId());
            return promotionMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create promotion: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create promotion", e);
        }
    }

    public PromotionResponse getPromotionById(UUID id) {
        logger.info("Fetching promotion with ID: {}", id);

        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Promotion not found with ID: {}", id);
                    return new ResourceNotFoundException("Promotion not found");
                });
        return promotionMapper.toResponse(promotion);
    }

    @Transactional
    public PromotionResponse updatePromotion(UUID id, PromotionRequest request) {
        logger.info("Updating promotion with ID: {}", id);

        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Promotion not found with ID: {}", id);
                    return new ResourceNotFoundException("Promotion not found");
                });

        // If code is changed, check for duplicates
        if (!promotion.getCode().equals(request.getCode()) && promotionRepository.existsByCode(request.getCode())) {
            logger.error("[update] Promotion code already exists: {}", request.getCode());
            throw new IllegalArgumentException("Promotion code already exists");
        }

        // Check the time
        if (request.getValidTo().isBefore(request.getValidFrom())) {
            logger.error("[update] Valid to {} is before valid from {}", request.getValidTo(), request.getValidFrom());
            throw new IllegalArgumentException("Valid to cannot be before valid from");
        }

        // Check maxUses
        if (request.getMaxUses() != null && request.getMaxUses() <= 0) {
            logger.error("[update] Max uses must be positive: {}", request.getMaxUses());
            throw new IllegalArgumentException("Max uses must be positive");
        }

        // If you decrease maxUses, make sure usedCount does not exceed
        if (request.getMaxUses() != null && promotion.getUsedCount() > request.getMaxUses()) {
            logger.error("[update] Used count {} exceeds new max uses {}", promotion.getUsedCount(), request.getMaxUses());
            throw new IllegalArgumentException("Used count exceeds new max uses");
        }

        promotion.setCode(request.getCode());
        promotion.setDiscountPercent(request.getDiscountPercent());
        promotion.setValidFrom(request.getValidFrom());
        promotion.setValidTo(request.getValidTo());
        promotion.setMaxUses(request.getMaxUses());
        promotion.setMinBookingAmount(request.getMinBookingAmount());

        try {
            Promotion updated = promotionRepository.save(promotion);
            logger.info("Promotion updated successfully with ID: {}", id);
            return promotionMapper.toResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update promotion: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update promotion", e);
        }
    }

    @Transactional
    public void deletePromotion(UUID id) {
        logger.info("Deleting promotion with ID: {}", id);

        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Promotion not found with ID: {}", id);
                    return new ResourceNotFoundException("Promotion not found");
                });

        if (!promotion.getBookings().isEmpty()) {
            logger.error("Cannot delete promotion with associated bookings: {}", id);
            throw new IllegalStateException("Cannot delete promotion with associated bookings");
        }

        try {
            promotion.setIsActive(false);
            promotionRepository.save(promotion);
            logger.info("Promotion deleted (soft) successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete promotion: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete promotion", e);
        }
    }

    public PagedResponse<PromotionResponse> getAllPromotions(PromotionFilterRequest filterRequest) {
        logger.info("Searching promotions with = {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);

        Specification<Promotion> spec = PromotionSpecification.build(filterRequest);

        Page<Promotion> pageResult = promotionRepository.findAll(spec, pageable);

        List<PromotionResponse> content = pageResult.getContent()
                .stream()
                .map(promotionMapper::toResponse)
                .toList();

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }
}
