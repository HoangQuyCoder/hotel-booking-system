package com.example.backend.service;

import com.example.backend.exception.EmailSendException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    // Send emails synchronously
    public void sendEmail(String toEmail, String subject, String content) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true); // true = HTML

            mailSender.send(message);
            logger.info("Email '{}' sent to {}", subject, toEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new EmailSendException("Failed to send email to " + toEmail, e);
        }
    }

    // Send emails asynchronously
    @Async
    public void sendEmailAsync(String toEmail, String subject, String content) {
        try {
            sendEmail(toEmail, subject, content);
        } catch (Exception e) {
            logger.error("[ASYNC] Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new EmailSendException("Failed to send email to " + toEmail, e);
        }
    }
}
