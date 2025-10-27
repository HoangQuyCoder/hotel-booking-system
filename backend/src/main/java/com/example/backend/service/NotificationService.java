package com.example.backend.service;

import com.example.backend.common.NotificationStatus;
import com.example.backend.model.*;
import com.example.backend.repository.NotificationLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final EmailService emailService;
    private final NotificationTemplateService templateService;
    private final NotificationLogRepository notificationLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${frontend.reset-password-url}")
    private String resetPasswordUrl;

    // ------------------------------
    // PASSWORD RELATED
    // ------------------------------

    public void sendPasswordResetEmail(String toEmail, String resetToken) throws MessagingException {
        sendNotification(
                "PASSWORD_RESET",
                toEmail,
                "PasswordReset",
                Map.of(
                        "userName", toEmail,
                        "resetLink", resetPasswordUrl + "?token=" + resetToken
                )
        );
    }

    public void sendPasswordChangedEmail(String toEmail) throws MessagingException {
        sendNotification(
                "PASSWORD_CHANGED",
                toEmail,
                "PasswordChanged",
                Map.of("userName", toEmail, "loginUrl", "https://hotelify.com/login")
        );
    }

    // ------------------------------
    // BOOKING RELATED
    // ------------------------------

    public void sendBookingConfirmationEmail(Booking booking) {
        User user = booking.getUser();

        Map<String, Object> model = Map.of(
                "userName", user.getFirstName() + " " + user.getLastName(),
                "bookingCode", booking.getConfirmationCode(),
                "hotelName", booking.getHotel().getName(),
                "checkIn", booking.getCheckInDate().toString(),
                "checkOut", booking.getCheckOutDate().toString()
        );

        sendNotification("BOOKING_CONFIRMATION", user.getEmail(), "BookingConfirmation", model);
    }

    public void sendBookingCancelledEmail(Booking booking) {
        User user = booking.getUser();

        Map<String, Object> model = Map.of(
                "userName", user.getFirstName() + " " + user.getLastName(),
                "bookingCode", booking.getConfirmationCode(),
                "hotelName", booking.getHotel().getName(),
                "checkIn", booking.getCheckInDate().toString(),
                "checkOut", booking.getCheckOutDate().toString()
        );

        sendNotification("BOOKING_CANCELLED", user.getEmail(), "BookingCancelled", model);
    }

    // ------------------------------
    // PAYMENT RELATED
    // ------------------------------

    public void sendPaymentSuccessEmail(Transaction transaction) {
        sendPaymentEmail(transaction, "PAYMENT_SUCCESS", "PaymentSuccess");
    }

    public void sendPaymentRefundEmail(Transaction transaction) {
        sendPaymentEmail(transaction, "PAYMENT_REFUND", "PaymentRefund");
    }

    private void sendPaymentEmail(Transaction transaction, String templateName, String event) {
        Booking booking = transaction.getBooking();
        User user = booking.getUser();

        Map<String, Object> model = Map.of(
                "userName", user.getFirstName() + " " + user.getLastName(),
                "bookingCode", booking.getConfirmationCode(),
                "transactionCode", transaction.getId().toString(),
                "amount", transaction.getAmount().toString(),
                "paymentDate", transaction.getProcessedAt().toString()
        );

        sendNotification(templateName, user.getEmail(), event, model);
    }

    // ------------------------------
    // USER REGISTER RELATED
    // ------------------------------

    public void sendRegisterSuccessEmail(User user) {
        Map<String, Object> model = Map.of(
                "userName", user.getFirstName() + " " + user.getLastName(),
                "userEmail", user.getEmail()
        );

        sendNotification("REGISTER_SUCCESS", user.getEmail(), "RegisterSuccess", model);
    }

    // ------------------------------
    // CORE SENDING LOGIC
    // ------------------------------

    private void sendNotification(String templateName,
                                  String recipient,
                                  String event,
                                  Map<String, Object> placeholders) {
        NotificationTemplate template = templateService.getTemplate(templateName);

        NotificationLog log = NotificationLog.builder()
                .recipient(recipient)
                .template(template)
                .status(NotificationStatus.PENDING)
                .sourceEvent(event)
                .metadata(toJson(placeholders))
                .retryCount(0)
                .isActive(true)
                .build();

        notificationLogRepository.save(log);

        try {
            String content = templateService.buildContent(template.getTemplateFile(), placeholders);
            emailService.sendEmailAsync(recipient, template.getSubject(), content);

            log.setStatus(NotificationStatus.SENT);
            log.setSentAt(LocalDateTime.now());
            log.setErrorMessage(null);
            logger.info("Notification '{}' sent to {}", template.getName(), recipient);

        } catch (Exception e) {
            log.setStatus(NotificationStatus.FAILED);
            log.setErrorMessage(e.getMessage());
            log.setRetryCount(log.getRetryCount() + 1);
            logger.error("Failed to send notification '{}' to {}: {}", template.getName(), recipient, e.getMessage());
        } finally {
            log.setUpdatedAt(LocalDateTime.now());
            notificationLogRepository.save(log);
        }
    }

    private String toJson(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            logger.warn("Failed to serialize metadata", e);
            return null;
        }
    }
}
