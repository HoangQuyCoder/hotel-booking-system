package com.example.backend.service;

import com.example.backend.exception.*;
import com.example.backend.model.EmailVerification;
import com.example.backend.repository.EmailVerificationRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerificationService {

    private final EmailVerificationRepository verificationRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    private static final int OTP_LENGTH = 6;
    private static final long EXPIRY_MINUTES = 5;

    // Send OTP code
    public void sendVerificationCode(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already registered!");
        }

        // Generate new code
        String code = generateOtp();

        // Save new OTP
        EmailVerification verification = new EmailVerification(email, code);
        verificationRepository.save(verification);

        // Send email
        try {
            sendOtpEmail(email, code);
        } catch (Exception e) {
            throw new EmailSendException("Failed to send verification email", e);
        }
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

    // Check if email is verified (used during registration)
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
        int min = (int) Math.pow(10, OTP_LENGTH - 1);
        int max = (int) Math.pow(10, OTP_LENGTH) - 1;
        return String.valueOf(random.nextInt(max - min + 1) + min);
    }

    private void sendOtpEmail(String toEmail, String code) {
        emailService.sendEmail(
                toEmail,
                "Account Verification Code - HotelBooking",
                """
                Hello,
        
                Your account verification code is:
        
                %s
        
                This code is valid for %d minutes.
                If you did not request this, please ignore this email.
        
                Best regards,
                HotelBooking Team
                """.formatted(code, EXPIRY_MINUTES)
        );
    }
}

