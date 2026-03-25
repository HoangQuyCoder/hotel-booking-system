package com.example.backend.service;

import com.example.backend.common.BookingStatus;
import com.example.backend.dto.filter.BookingFilterRequest;
import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.request.BookingRoomRequest;
import com.example.backend.dto.response.BookingCalculationResponse;
import com.example.backend.dto.response.BookingListResponse;
import com.example.backend.dto.response.BookingResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.BookingMapper;
import com.example.backend.model.*;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.specification.BookingSpecification;
import com.example.backend.utils.PagingUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final BookingCalculationService bookingCalc;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final NotificationService notificationService;
    private final BookingMapper bookingMapper;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        logger.info("Creating booking for check-in: {}, check-out: {}", request.getCheckInDate(), request.getCheckOutDate());

        if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            logger.error("[create] Check-out date {} is before check-in date {}", request.getCheckOutDate(), request.getCheckInDate());
            throw new IllegalArgumentException("Check-out date cannot be before check-in date");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", auth.getName());
                    return new ResourceNotFoundException("User not found");
                });

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> {
                    logger.error("Hotel not found with ID: {}", request.getHotelId());
                    return new ResourceNotFoundException("Hotel not found");
                });

        List<UUID> roomTypeIds = request.getBookingRooms()
                .stream()
                .map(BookingRoomRequest::getRoomTypeId)
                .toList();

        List<RoomType> roomTypes = roomTypeRepository
                .findAllByIdInAndHotelId(roomTypeIds, request.getHotelId());

        if (roomTypes.size() != roomTypeIds.size()) {
            logger.error("Some room types do not belong to hotel {}", request.getHotelId());
            throw new IllegalArgumentException("One or more room types are invalid for this hotel");
        }

        Random random = new Random();
        BookingCalculationResponse calc = bookingCalc.calculateBookingTotal(request);

        Booking booking = bookingMapper.toEntity(request);
        booking.setStatus(BookingStatus.PENDING);
        booking.setHotel(hotel);
        booking.setUser(user);
        booking.setPromotion(calc.getPromotion());
        booking.setBookingRooms(calc.getBookingRooms());
        booking.setTotalAmount(calc.getTotalAmount());
        booking.setConfirmationCode(String.valueOf(100000 + random.nextInt(900000)));
        booking.getBookingRooms().forEach(br -> br.setBooking(booking));

        try {
            Booking saved = bookingRepository.save(booking);
            logger.info("Booking created successfully with ID: {}", saved.getId());
            return bookingMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create booking: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create booking", e);
        }
    }

    public BookingResponse getBookingById(UUID id) {
        logger.info("Fetching booking with ID: {}", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Booking not found with ID: {}", id);
                    return new ResourceNotFoundException("Booking not found");
                });

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF")) &&
                !booking.getUser().getEmail().equals(auth.getName())) {
            logger.error("Unauthorized access to booking ID: {} by user: {}", id, auth.getName());
            throw new SecurityException("Unauthorized access to booking");
        }

        return bookingMapper.toResponse(booking);
    }

    @Transactional
    public BookingResponse updateBooking(UUID id, BookingRequest request) {
        logger.info("Updating booking with ID: {}", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        validateUpdatePermission(booking, auth);

        if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date cannot be before check-in date");
        }

        bookingMapper.updateEntityFromRequest(request, booking);

        // Determine whether recalculation is needed
        boolean shouldRecalculate =
                !request.getCheckInDate().equals(booking.getCheckInDate()) ||
                        !request.getCheckOutDate().equals(booking.getCheckOutDate()) ||
                        !Objects.equals(request.getPromoCode(),
                                booking.getPromotion() != null ? booking.getPromotion().getCode() : null) ||
                        isBookingRoomsChanged(request.getBookingRooms(), booking.getBookingRooms());

        if (shouldRecalculate) {
            logger.info("[update] Recalculating booking total for ID: {}", id);
            BookingCalculationResponse calc = bookingCalc.calculateBookingTotal(request);

            booking.setCheckInDate(request.getCheckInDate());
            booking.setCheckOutDate(request.getCheckOutDate());
            booking.setPromotion(calc.getPromotion());
            booking.setBookingRooms(calc.getBookingRooms());
            booking.setTotalAmount(calc.getTotalAmount());
        }

        Booking updated = bookingRepository.save(booking);
        logger.info("Booking updated successfully with ID: {}", id);
        return bookingMapper.toResponse(updated);
    }

    @Transactional
    public void cancelBooking(UUID id) {
        logger.info("Cancelling booking with ID: {}", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[cancel] Booking not found with ID: {}", id);
                    return new ResourceNotFoundException("Booking not found");
                });

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !booking.getUser().getEmail().equals(auth.getName())) {
            logger.error("Unauthorized cancel attempt on booking ID: {} by user: {}", id, auth.getName());
            throw new SecurityException("Unauthorized to cancel booking");
        }

        if (booking.getStatus() == BookingStatus.CHECKED_IN || booking.getStatus() == BookingStatus.CHECKED_OUT) {
            logger.error("Cannot cancel booking ID: {} with status: {}", id, booking.getStatus());
            throw new IllegalStateException("Cannot cancel checked-in or checked-out booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setIsActive(false);

        try {
            notificationService.sendBookingCancelledEmail(booking);
            bookingRepository.save(booking);
            logger.info("Booking cancelled successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to cancel booking: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to cancel booking", e);
        }
    }

    @Transactional
    public BookingResponse checkInBooking(UUID id) {
        logger.info("Checking in booking with ID: {}", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[checkIn] Booking not found with ID: {}", id);
                    return new ResourceNotFoundException("Booking not found");
                });

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            logger.error("Cannot check-in booking ID: {} with status: {}", id, booking.getStatus());
            throw new IllegalStateException("Only CONFIRMED bookings can be checked in");
        }

        booking.setStatus(BookingStatus.CHECKED_IN);

        try {
            Booking updated = bookingRepository.save(booking);
            logger.info("Booking checked in successfully with ID: {}", id);
            return bookingMapper.toResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to check-in booking: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to check-in booking", e);
        }
    }

    @Transactional
    public BookingResponse checkOutBooking(UUID id) {
        logger.info("Checking out booking with ID: {}", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[checkOut] Booking not found with ID: {}", id);
                    return new ResourceNotFoundException("Booking not found");
                });

        if (booking.getStatus() != BookingStatus.CHECKED_IN) {
            logger.error("Cannot check-out booking ID: {} with status: {}", id, booking.getStatus());
            throw new IllegalStateException("Only CHECKED_IN bookings can be checked out");
        }

        booking.setStatus(BookingStatus.CHECKED_OUT);

        try {
            Booking updated = bookingRepository.save(booking);
            logger.info("Booking checked out successfully with ID: {}", id);
            return bookingMapper.toResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to check-out booking: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to check-out booking", e);
        }
    }

    @Transactional(readOnly = true)
    public PagedResponse<BookingListResponse> getAllBookings(BookingFilterRequest filterRequest) {
        logger.info("Filtering bookings with: {}", filterRequest);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdminOrStaff = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF"));

        // If you are a normal user, only see your booking
        if (!isAdminOrStaff) {
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            filterRequest.setUserId(user.getId());
        }

        Pageable pageable = PagingUtils.toPageable(filterRequest);

        Specification<Booking> spec = BookingSpecification.build(filterRequest);

        Page<Booking> pageResult = bookingRepository.findAll(spec, pageable);

        List<BookingListResponse> content = pageResult.getContent().stream()
                .map(bookingMapper::toListResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }

    private void validateUpdatePermission(Booking booking, Authentication auth) {
        String currentUser = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // If you are not an admin, you can only update your booking
        if (!isAdmin && !booking.getUser().getEmail().equals(currentUser)) {
            logger.error("Unauthorized update attempt on booking ID: {} by user: {}", booking.getId(), currentUser);
            throw new SecurityException("Unauthorized to update this booking");
        }

        // Users are usually only updated with booking status PENDING
        if (!isAdmin && booking.getStatus() != BookingStatus.PENDING) {
            logger.error("Client cannot update booking ID: {} with status: {}", booking.getId(), booking.getStatus());
            throw new IllegalStateException("Only PENDING bookings can be updated by client");
        }
    }

    private boolean isBookingRoomsChanged(List<BookingRoomRequest> newRooms, List<BookingRoom> oldRooms) {
        if (newRooms == null || oldRooms == null) return true;
        if (newRooms.size() != oldRooms.size()) return true;

        // Create a temporary map to compare rooms by roomTypeId
        Map<UUID, Integer> oldRoomMap = oldRooms.stream()
                .collect(Collectors.toMap(
                        room -> room.getRoomType().getId(),
                        BookingRoom::getQuantity
                ));

        for (BookingRoomRequest newRoom : newRooms) {
            Integer oldQty = oldRoomMap.get(newRoom.getRoomTypeId());
            if (oldQty == null || !oldQty.equals(newRoom.getQuantity())) {
                return true; // Room type or quantity change
            }
        }
        return false;
    }
}
