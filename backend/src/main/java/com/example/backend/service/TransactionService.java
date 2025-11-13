package com.example.backend.service;

import com.example.backend.common.BookingStatus;
import com.example.backend.common.PaymentMethod;
import com.example.backend.common.TransactionStatus;
import com.example.backend.common.TransactionType;
import com.example.backend.dto.filter.TransactionFilterRequest;
import com.example.backend.dto.request.TransactionRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.TransactionResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.TransactionMapper;
import com.example.backend.model.Booking;
import com.example.backend.model.Transaction;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.specification.TransactionSpecification;
import com.example.backend.utils.PagingUtils;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);
    private static final long TRANSACTION_TIMEOUT_HOURS = 1; // Time limit for soft delete

    private final TransactionRepository transactionRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final TransactionMapper transactionMapper;

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        logger.info("Creating transaction for booking ID: {}", request.getBookingId());

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isStaff = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STAFF"));
        boolean isClient = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CLIENT"));
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isStaff && !isClient && !isAdmin) {
            logger.error("Unauthorized transaction creation attempt by user: {}", auth.getName());
            throw new SecurityException("Unauthorized to create transaction");
        }

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> {
                    logger.error("Booking not found with ID: {}", request.getBookingId());
                    return new ResourceNotFoundException("Booking not found");
                });

        if (isClient && !booking.getUser().getUsername().equals(auth.getName())) {
            logger.error("Client {} cannot create transaction for booking ID: {}", auth.getName(), request.getBookingId());
            throw new SecurityException("Unauthorized to create transaction for this booking");
        }

        if (booking.getTransaction() != null && booking.getTransaction().getIsActive()) {
            logger.error("Booking ID: {} already has an active transaction", request.getBookingId());
            throw new IllegalStateException("Booking already has an active transaction");
        }

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            logger.error("Cannot create transaction for booking ID: {} with status: {}", request.getBookingId(), booking.getStatus());
            throw new IllegalStateException("Booking must be in PENDING or CONFIRMED status");
        }

        if (!Objects.equals(request.getAmount(), booking.getTotalAmount())) {
            logger.error("Transaction amount {} does not match booking amount {}", request.getAmount(), booking.getTotalAmount());
            throw new IllegalArgumentException("Transaction amount must match booking amount");
        }

        if (isClient && request.getPaymentMethod() == PaymentMethod.CASH) {
            logger.error("Client cannot use CASH payment method");
            throw new IllegalArgumentException("Client cannot use CASH payment method");
        }

        Transaction transaction = Transaction.builder()
                .booking(booking)
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .paymentMethod(request.getPaymentMethod())
                .status(TransactionStatus.PENDING)
                .gatewayRef(request.getGatewayRef())
                .transactionType(TransactionType.PAYMENT)
                .processedAt(LocalDateTime.now())
                .isActive(true)
                .build();

        try {
            Transaction saved = transactionRepository.save(transaction);
            booking.setStatus(BookingStatus.CONFIRMED); // Update booking status to CONFIRMED
            booking.setTransaction(saved);
            bookingRepository.save(booking);
            notificationService.sendBookingConfirmationEmail(booking);
            logger.info("Transaction created successfully with ID: {}", saved.getId());
            return transactionMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create transaction: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create transaction", e);
        }
    }

    public TransactionResponse getTransactionById(UUID id) {
        logger.info("Fetching transaction with ID: {}", id);

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Transaction not found with ID: {}", id);
                    return new ResourceNotFoundException("Transaction not found");
                });

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF")) &&
                !transaction.getBooking().getUser().getUsername().equals(auth.getName())) {
            logger.error("Unauthorized access to transaction ID: {} by user: {}", id, auth.getName());
            throw new SecurityException("Unauthorized access to transaction");
        }

        return transactionMapper.toResponse(transaction);
    }

    @Transactional
    public TransactionResponse refundTransaction(UUID id) {
        logger.info("Refunding transaction with ID: {}", id);

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[refund] Transaction not found with ID: {}", id);
                    return new ResourceNotFoundException("Transaction not found");
                });

        if (transaction.getStatus() == TransactionStatus.REFUNDED) {
            logger.error("Transaction ID: {} is already refunded", id);
            throw new IllegalStateException("Transaction is already refunded");
        }

        if (transaction.getStatus() != TransactionStatus.COMPLETED) {
            logger.error("Cannot refund transaction ID: {} with status: {}", id, transaction.getStatus());
            throw new IllegalStateException("Only COMPLETED transactions can be refunded");
        }

        Transaction refundTransaction = Transaction.builder()
                .booking(transaction.getBooking())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .paymentMethod(transaction.getPaymentMethod())
                .status(TransactionStatus.REFUNDED)
                .gatewayRef("REFUND-" + transaction.getGatewayRef())
                .transactionType(TransactionType.REFUND)
                .processedAt(LocalDateTime.now())
                .isActive(true)
                .build();

        try {
            transaction.setStatus(TransactionStatus.REFUNDED);
            transactionRepository.save(transaction);
            Transaction saved = transactionRepository.save(refundTransaction);
            notificationService.sendPaymentRefundEmail(saved);
            logger.info("Transaction refunded successfully with ID: {}", id);
            return transactionMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to refund transaction: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to refund transaction", e);
        }
    }

    public PagedResponse<TransactionResponse> getAllTransactions(TransactionFilterRequest filterRequest) {
        logger.info("Searching transactions with: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);

        Specification<Transaction> spec = TransactionSpecification.build(filterRequest);

        Page<Transaction> pageResult = transactionRepository.findAll(spec, pageable);

        List<TransactionResponse> content = pageResult.getContent().stream()
                .map(transactionMapper::toResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }

    @Transactional
    public void deleteTransaction(UUID id) {
        logger.info("Deleting transaction with ID: {}", id);

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[delete] Transaction not found with ID: {}", id);
                    return new ResourceNotFoundException("Transaction not found");
                });

        if (transaction.getStatus() != TransactionStatus.PENDING) {
            logger.error("Cannot delete transaction ID: {} with status: {}", id, transaction.getStatus());
            throw new IllegalStateException("Only PENDING transactions can be deleted");
        }

        long hoursSinceCreation = ChronoUnit.HOURS.between(transaction.getCreatedAt(), LocalDateTime.now());
        if (hoursSinceCreation > TRANSACTION_TIMEOUT_HOURS) {
            logger.error("Transaction ID: {} cannot be deleted after {} hours", id, TRANSACTION_TIMEOUT_HOURS);
            throw new IllegalStateException("Transaction cannot be deleted after " + TRANSACTION_TIMEOUT_HOURS + " hours");
        }

        try {
            transaction.setIsActive(false);
            transactionRepository.save(transaction);
            logger.info("Transaction deleted (soft) successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed to delete transaction: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete transaction", e);
        }
    }

    @Transactional
    public TransactionResponse updateTransactionStatus(UUID id, TransactionStatus status) {
        logger.info("Updating transaction status for ID: {} to {}", id, status);

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Transaction not found with ID: {}", id);
                    return new ResourceNotFoundException("Transaction not found");
                });

        if (transaction.getStatus() != TransactionStatus.PENDING) {
            logger.error("Cannot update transaction ID: {} with status: {}", id, transaction.getStatus());
            throw new IllegalStateException("Only PENDING transactions can be updated");
        }

        if (status != TransactionStatus.COMPLETED && status != TransactionStatus.FAILED) {
            logger.error("Invalid status update for transaction ID: {} to {}", id, status);
            throw new IllegalArgumentException("Status must be COMPLETED or FAILED");
        }

        transaction.setStatus(status);
        transaction.setProcessedAt(LocalDateTime.now());

        try {
            Transaction saved = transactionRepository.save(transaction);
            if (status == TransactionStatus.COMPLETED) {
                notificationService.sendPaymentSuccessEmail(saved);
            }
            logger.info("Transaction status updated successfully for ID: {} to {}", id, status);
            return transactionMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to update transaction status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update transaction status", e);
        }
    }
}
