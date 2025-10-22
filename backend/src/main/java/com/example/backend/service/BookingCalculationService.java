package com.example.backend.service;

import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.BookingCalculationResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.BaseRateRepository;
import com.example.backend.repository.DailyOverrideRepository;
import com.example.backend.repository.PromotionRepository;
import com.example.backend.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingCalculationService {

    private static final Logger logger = LoggerFactory.getLogger(BookingCalculationService.class);

    private final PromotionRepository promotionRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BaseRateRepository baseRateRepository;
    private final DailyOverrideRepository dailyOverrideRepository;

    public BookingCalculationResponse calculateBookingTotal(BookingRequest request) {
        Promotion promotion = validateAndGetPromotion(request.getPromoCode());
        List<BookingRoom> bookingRooms = buildBookingRooms(request);
        double totalAmount = calculateTotalAmount(bookingRooms);
        totalAmount = applyPromotionIfEligible(promotion, totalAmount);

        return BookingCalculationResponse.builder()
                .promotion(promotion)
                .bookingRooms(bookingRooms)
                .totalAmount(totalAmount)
                .build();
    }

    // Get & validate Promotion
    private Promotion validateAndGetPromotion(String promoCode) {
        if (promoCode == null || promoCode.isBlank()) {
            return null;
        }

        Promotion promotion = promotionRepository.findByCode(promoCode)
                .orElseThrow(() -> {
                    logger.error("[calculateBookingTotal] Promotion not found: {}", promoCode);
                    return new ResourceNotFoundException("Promotion not found");
                });

        boolean invalid = !promotion.getIsActive()
                || promotion.getValidTo().isBefore(LocalDateTime.now())
                || promotion.getValidFrom().isAfter(LocalDateTime.now())
                || (promotion.getMaxUses() != null && promotion.getUsedCount() >= promotion.getMaxUses());

        if (invalid) {
            logger.error("[calculateBookingTotal] Promotion not valid: {}", promoCode);
            throw new IllegalArgumentException("Promotion is not valid");
        }

        return promotion;
    }

    // Create a list of BookingRoom
    private List<BookingRoom> buildBookingRooms(BookingRequest request) {
        return request.getBookingRooms().stream()
                .map(bookingRoomReq -> {
                    RoomType roomType = roomTypeRepository.findById(bookingRoomReq.getRoomTypeId())
                            .orElseThrow(() -> {
                                logger.error("[calculateBookingTotal] RoomType not found: {}", bookingRoomReq.getRoomTypeId());
                                return new ResourceNotFoundException("RoomType not found");
                            });

                    double pricePerNight = calculateRoomPrice(
                            roomType.getId(),
                            request.getCheckInDate(),
                            request.getCheckOutDate()
                    );

                    return BookingRoom.builder()
                            .roomType(roomType)
                            .specificRoomIds(bookingRoomReq.getSpecificRoomIds())
                            .pricePerNight(pricePerNight)
                            .quantity(bookingRoomReq.getQuantity())
                            .isActive(true)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // Calculate the total amount
    private double calculateTotalAmount(List<BookingRoom> bookingRooms) {
        return bookingRooms.stream()
                .mapToDouble(br -> br.getPricePerNight() * br.getQuantity())
                .sum();
    }

    // Discount applies
    private double applyPromotionIfEligible(Promotion promotion, double totalAmount) {
        if (promotion == null) return totalAmount;

        if (promotion.getMinBookingAmount() == null || totalAmount >= promotion.getMinBookingAmount()) {
            double discounted = totalAmount * (1 - promotion.getDiscountPercent() / 100);
            promotion.setUsedCount(promotion.getUsedCount() + 1);
            promotionRepository.save(promotion);
            return discounted;
        }

        return totalAmount;
    }

    // Calculate room price
    private double calculateRoomPrice(UUID roomTypeId, LocalDate checkInDate, LocalDate checkOutDate) {
        double totalPrice = 0.0;
        for (LocalDate date = checkInDate; !date.isAfter(checkOutDate); date = date.plusDays(1)) {
            DailyOverride override = dailyOverrideRepository.findByRoomTypeIdAndDate(roomTypeId, date)
                    .orElse(null);
            if (override != null && override.getPriceAdjustment() != null) {
                totalPrice += override.getPriceAdjustment();
            } else {
                LocalDate finalDate = date;
                BaseRate baseRate = baseRateRepository.findByRoomTypeIdAndOverlappingDates(roomTypeId, date)
                        .orElseThrow(() -> {
                            logger.error("No base rate found for room type ID: {} on date: {}", roomTypeId, finalDate);
                            return new ResourceNotFoundException("No base rate found for the given date");
                        });
                totalPrice += baseRate.getBasePrice();
            }
        }
        return totalPrice;
    }
}

