package com.example.backend.service;

import com.example.backend.model.NotificationTemplate;
import com.example.backend.repository.NotificationTemplateRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final NotificationTemplateRepository notificationTemplateRepository;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Value("${frontend.reset-password-url}")
    private String resetPasswordUrl;

    public EmailService(JavaMailSender mailSender, NotificationTemplateRepository notificationTemplateRepository) {
        this.mailSender = mailSender;
        this.notificationTemplateRepository = notificationTemplateRepository;
    }

    // Send password reset email
    public void sendPasswordResetEmail(String toEmail, String resetToken) throws MessagingException {
        NotificationTemplate template = getTemplate("PASSWORD_RESET");
        String resetLink = resetPasswordUrl + "?token=" + resetToken;
        String content = template.getContent().replace("{reset_link}", resetLink);
        sendEmail(toEmail, template, content);
    }

    // Send email notification of password change
    public void sendPasswordChangedEmail(String toEmail) throws MessagingException {
        NotificationTemplate template = getTemplate("PASSWORD_CHANGED");
        sendEmail(toEmail, template, template.getContent());
    }

    @Async
    public void sendPasswordChangedEmailAsync(String toEmail) {
        try {
            sendPasswordChangedEmail(toEmail);
            logger.info("[ASYNC] Password changed email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("[ASYNC] Failed to send password changed email to {}: {}", toEmail, e.getMessage());
        }
    }

    // Reusable function to send email
    private void sendEmail(String toEmail, NotificationTemplate template, String content) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(template.getSubject());
            helper.setText(content, true);

            mailSender.send(message);
            logger.info("Email '{}' sent to: {}", template.getName(), toEmail);
        } catch (Exception e) {
            logger.error("Failed to send email '{}' to {}: {}", template.getName(), toEmail, e.getMessage());
            throw new MessagingException("Failed to send email", e);
        }
    }

    // Function to get template by name
    private NotificationTemplate getTemplate(String name) {
        return notificationTemplateRepository.findByName(name)
                .orElseThrow(() -> {
                    logger.error("{} template not found", name);
                    return new IllegalStateException(name + " template not found");
                });
    }
}
