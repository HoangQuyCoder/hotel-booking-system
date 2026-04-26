package com.example.backend.service;

import com.example.backend.dto.filter.ReviewFilterRequest;
import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.ReviewMapper;
import com.example.backend.model.Hotel;
import com.example.backend.model.Review;
import com.example.backend.model.User;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.specification.ReviewSpecification;
import com.example.backend.utils.PagingUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Transactional
    public ReviewResponse create(@NonNull ReviewRequest request) {
        logger.info("Creating review for user {} and hotel {}", request.getUserId(), request.getHotelId());

        try {
            Review review = reviewMapper.toEntity(Objects.requireNonNull(request));

            Hotel hotel = hotelRepository.findById(Objects.requireNonNull(request.getHotelId()))
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Hotel not found with id: " + request.getHotelId()));

            User user = userRepository.findById(Objects.requireNonNull(request.getUserId()))
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

            review.setHotel(hotel);
            review.setUser(user);

            Review saved = reviewRepository.save(review);
            logger.info("Review created successfully with id {}", saved.getId());

            return reviewMapper.toResponse(saved);

        } catch (ResourceNotFoundException ex) {
            logger.warn("[create] Business exception: {}", ex.getMessage());
            throw ex;

        } catch (Exception e) {
            logger.error("Unexpected error while creating review: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create review. Please try again.", e);
        }
    }

    @Transactional
    public ReviewResponse update(@NonNull UUID id, @NonNull ReviewRequest request) {
        logger.info("Updating review with id {}", id);

        try {
            Review review = reviewRepository.findById(Objects.requireNonNull(id))
                    .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

            reviewMapper.updateEntity(Objects.requireNonNull(request), review);

            Review updated = reviewRepository.save(Objects.requireNonNull(review));
            logger.info("Review updated successfully with id {}", id);

            return reviewMapper.toResponse(updated);

        } catch (ResourceNotFoundException ex) {
            logger.warn("[update] Business exception: {}", ex.getMessage());
            throw ex;

        } catch (Exception e) {
            logger.error("Unexpected error while updating review {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to update review with id: " + id, e);
        }
    }

    @Transactional
    public void delete(@NonNull UUID id) {
        logger.warn("Soft deleting review with id {}", id);

        try {
            Review review = reviewRepository.findById(Objects.requireNonNull(id))
                    .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

            review.setIsActive(false);
            reviewRepository.save(review);

            logger.info("Review {} deactivated successfully", id);

        } catch (ResourceNotFoundException ex) {
            logger.warn("[delete] Business exception: {}", ex.getMessage());
            throw ex;

        } catch (Exception e) {
            logger.error("Unexpected error while deleting review {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete review with id: " + id, e);
        }
    }

    @Transactional
    public ReviewResponse getReviewById(@NonNull UUID id) {
        logger.info("Fetching review by id {}", id);

        try {
            Review review = reviewRepository.findById(Objects.requireNonNull(id))
                    .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

            return reviewMapper.toResponse(review);

        } catch (ResourceNotFoundException ex) {
            logger.warn("Business exception: {}", ex.getMessage());
            throw ex;

        } catch (Exception e) {
            logger.error("Unexpected error while fetching review {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch review with id: " + id, e);
        }
    }

    @Transactional
    public PagedResponse<ReviewResponse> getAll(ReviewFilterRequest filterRequest) {
        logger.info("Fetching all reviews with filters");

        try {
            Pageable pageable = PagingUtils.toPageable(filterRequest);

            Specification<Review> spec = ReviewSpecification.build(filterRequest);

            Page<Review> reviewPage = reviewRepository.findAll(Objects.requireNonNull(spec),
                    Objects.requireNonNull(pageable));

            List<ReviewResponse> content = reviewPage.getContent()
                    .stream()
                    .map(reviewMapper::toResponse)
                    .collect(Collectors.toList());

            logger.info("Fetched {} reviews", content.size());

            return new PagedResponse<>(
                    content,
                    reviewPage.getNumber(),
                    reviewPage.getSize(),
                    reviewPage.getTotalElements(),
                    reviewPage.getTotalPages());

        } catch (Exception e) {
            logger.error("Unexpected error while fetching reviews: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch review list. Please try again.", e);
        }
    }

    @Transactional
    public PagedResponse<ReviewResponse> getReviewsByHotelId(UUID hotelId, int page, int size) {
        logger.info("Fetching reviews by hotel id {}", hotelId);

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Review> reviewPage = reviewRepository.findByHotelId(hotelId, pageable);

            if (reviewPage.isEmpty()) {
                throw new ResourceNotFoundException("No reviews found for hotelId: " + hotelId);
            }

            List<ReviewResponse> content = reviewPage.getContent()
                    .stream()
                    .map(reviewMapper::toResponse)
                    .toList();

            return new PagedResponse<>(
                    content,
                    reviewPage.getNumber(),
                    reviewPage.getSize(),
                    reviewPage.getTotalElements(),
                    reviewPage.getTotalPages());

        } catch (Exception e) {
            logger.error("Unexpected error while fetching reviews: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch review list. Please try again.", e);
        }
    }
}
