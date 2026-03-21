package com.example.backend.service;

import com.example.backend.config.OtpConfig;
import com.example.backend.dto.response.EmailVerificationResponse;
import com.example.backend.exception.*;
import com.example.backend.model.EmailVerification;
import com.example.backend.repository.EmailVerificationRepository;
import com.example.backend.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final EmailVerificationRepository verificationRepository;
    private final UserRepository userRepository;
    private final OtpConfig otpConfig;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    // Send OTP code
    public EmailVerificationResponse requestEmailVerification(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already registered!");
        }

        // Generate new code
        String code = generateOtp();

        // Create OTP entry with dynamic expiry from config
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .expiryTime(LocalDateTime.now().plusMinutes(otpConfig.getExpiryMinutes()))
                .build();

        EmailVerification saved = verificationRepository.save(verification);

        return EmailVerificationResponse.builder()
                .email(saved.getEmail())
                .code(saved.getCode())
                .expiryTime(saved.getExpiryTime())
                .build();
    }

    // Verify OTP code
    public void verifyCode(String email, String code) {
        EmailVerification verification = verificationRepository
                .findTopByEmailOrderByExpiryTimeDesc(email)
                .orElseThrow(() -> new BadRequestException("Invalid verification code"));

        if (verification.isExpired()) {
            throw new TokenExpiredException("Verification code has expired");
        }

        if (!verification.getCode().equals(code)) {
            throw new BadRequestException("Invalid verification code");
        }

        // Mark as used
        verification.setUsed(true);
        verificationRepository.save(verification);
    }

    // Check if email is verified
    public void validateEmailVerified(String email) {
        boolean verified = verificationRepository
                .findTopByEmailOrderByExpiryTimeDesc(email)
                .map(v -> !v.isExpired() && v.isUsed())
                .orElse(false);

        if (!verified) {
            throw new ForbiddenException("Email has not been verified");
        }
    }

    private String generateOtp() {
        Random random = new Random();
        int length = otpConfig.getLength();

        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length) - 1;

        return String.valueOf(random.nextInt(max - min + 1) + min);
    }

    // Send emails synchronously
    @Async
    public void sendEmail(String toEmail, String subject, String content) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true); // true = HTML

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendException("Failed to send email to " + toEmail, e);
        }
    }
}
