package com.example.backend.service;

import com.example.backend.common.NotificationStatus;
import com.example.backend.dto.response.EmailVerificationResponse;
import com.example.backend.model.*;
import com.example.backend.repository.NotificationLogRepository;
import com.example.backend.repository.UserRepository;
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
        private final UserRepository userRepository;

        @Value("${frontend.reset-password-url}")
        private String resetPasswordUrl;

        // ------------------------------
        // HELPER
        // ------------------------------

        private User getUserByEmail(String email) {
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        }

        // ------------------------------
        // REGISTER RELATED
        // ------------------------------

        public void sendEmailVerificationCode(String toEmail) {
                User user = getUserByEmail(toEmail);

                EmailVerificationResponse verificationResponse = emailService.requestEmailVerification(toEmail);

                sendNotification(
                                "VERIFICATION_CODE",
                                toEmail,
                                "VerificationCode",
                                Map.of(
                                                "email", toEmail,
                                                "code", verificationResponse.getCode(),
                                                "expiryTime", verificationResponse.getExpiryTime()),
                                user);
        }

        // ------------------------------
        // PASSWORD RELATED
        // ------------------------------

        public void sendPasswordResetEmail(String toEmail, String resetToken) {
                User user = getUserByEmail(toEmail);

                sendNotification(
                                "PASSWORD_RESET",
                                toEmail,
                                "PasswordReset",
                                Map.of(
                                                "email", toEmail,
                                                "resetLink", resetPasswordUrl + "?token=" + resetToken),
                                user);
        }

        public void sendPasswordChangedEmail(String toEmail) {
                User user = getUserByEmail(toEmail);

                sendNotification(
                                "PASSWORD_CHANGED",
                                toEmail,
                                "PasswordChanged",
                                Map.of(
                                                "email", toEmail,
                                                "loginUrl", "https://hotelify.com/login"),
                                user);
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
                                "checkOut", booking.getCheckOutDate().toString());

                sendNotification(
                                "BOOKING_CONFIRMATION",
                                user.getEmail(),
                                "BookingConfirmation",
                                model,
                                user);
        }

        public void sendBookingCancelledEmail(Booking booking) {
                User user = booking.getUser();

                Map<String, Object> model = Map.of(
                                "userName", user.getFirstName() + " " + user.getLastName(),
                                "bookingCode", booking.getConfirmationCode(),
                                "hotelName", booking.getHotel().getName(),
                                "checkIn", booking.getCheckInDate().toString(),
                                "checkOut", booking.getCheckOutDate().toString());

                sendNotification(
                                "BOOKING_CANCELLED",
                                user.getEmail(),
                                "BookingCancelled",
                                model,
                                user);
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
                                "paymentDate", transaction.getProcessedAt().toString());

                sendNotification(
                                templateName,
                                user.getEmail(),
                                event,
                                model,
                                user);
        }

        // ------------------------------
        // CORE SENDING LOGIC
        // ------------------------------

        private void sendNotification(String templateName,
                        String recipient,
                        String event,
                        Map<String, Object> placeholders,
                        User user) {

                NotificationTemplate template = templateService.getTemplate(templateName);

                NotificationLog log = NotificationLog.builder()
                                .recipient(recipient)
                                .template(template)
                                .status(NotificationStatus.PENDING)
                                .sourceEvent(event)
                                .metadata(placeholders)
                                .user(user)
                                .build();

                try {
                        String content = templateService.buildContent(template.getTemplateFile(), placeholders);
                        emailService.sendEmail(recipient, template.getSubject(), content);

                        log.setStatus(NotificationStatus.SENT);
                        log.setSentAt(LocalDateTime.now());
                        log.setErrorMessage(null);

                        logger.info("Notification '{}' sent to {}", template.getName(), recipient);

                } catch (Exception e) {
                        log.setStatus(NotificationStatus.FAILED);
                        log.setErrorMessage(e.getMessage());
                        log.setRetryCount(log.getRetryCount() + 1);

                        logger.error("Failed to send notification '{}' to {}: {}",
                                        template.getName(), recipient, e.getMessage());
                } finally {
                        notificationLogRepository.save(log);
                }
        }
}
