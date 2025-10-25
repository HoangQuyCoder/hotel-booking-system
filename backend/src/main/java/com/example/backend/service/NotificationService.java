package com.example.backend.service;

import com.example.backend.common.NotificationStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.NotificationLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
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
        NotificationTemplate template = templateService.getTemplate("PASSWORD_RESET");
        Map<String, String> placeholders = Map.of("reset_link", resetPasswordUrl + "?token=" + resetToken);
        String content = templateService.buildContent(template, placeholders);

        logAndSend(toEmail, template, "PasswordReset", placeholders, () -> {
            try {
                emailService.sendEmail(toEmail, template.getSubject(), content);
            } catch (MessagingException e) {
                throw new ResourceNotFoundException("Email could not be sent");
            }
        });
    }

    public void sendPasswordChangedEmail(String toEmail) throws MessagingException {
        NotificationTemplate template = templateService.getTemplate("PASSWORD_CHANGED");
        Map<String, String> placeholders = Map.of();
        String content = templateService.buildContent(template, placeholders);

        logAndSend(toEmail, template, "PasswordChanged", placeholders, () -> {
            try {
                emailService.sendEmail(toEmail, template.getSubject(), content);
            } catch (MessagingException e) {
                throw new ResourceNotFoundException("Email could not be found");
            }
        });
    }

    @Async
    public void sendPasswordChangedEmailAsync(String toEmail) {
        try {
            sendPasswordChangedEmail(toEmail);
        } catch (MessagingException e) {
            logger.error("[ASYNC] Failed to send password changed email to {}: {}", toEmail, e.getMessage());
        }
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

    private void sendPaymentEmail(Transaction transaction, String templateCode, String event) {
        Booking booking = transaction.getBooking();
        User user = booking.getUser();

        NotificationTemplate template = templateService.getTemplate(templateCode);
        Map<String, String> placeholders = Map.of(
                "confirmation_code", booking.getConfirmationCode(),
                "transaction_id", transaction.getId().toString()
        );
        String content = templateService.buildContent(template, placeholders);

        logAndSend(user.getEmail(), template, event, placeholders, () -> {
            try {
                emailService.sendEmail(user.getEmail(), template.getSubject(), content);
            } catch (MessagingException e) {
                throw new ResourceNotFoundException("Could not send payment email for user " + user.getEmail());
            }
        });
    }

    // ------------------------------
    // CORE LOGGING WRAPPER
    // ------------------------------

    private void logAndSend(String recipient,
                            NotificationTemplate template,
                            String event,
                            Map<String, String> placeholders,
                            Runnable sendAction) {
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
            sendAction.run();
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

    private String toJson(Map<String, String> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            logger.warn("Failed to serialize metadata", e);
            return null;
        }
    }
}