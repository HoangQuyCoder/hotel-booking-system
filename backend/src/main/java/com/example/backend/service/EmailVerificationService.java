package com.example.backend.service;

import com.example.backend.model.EmailVerification;
import com.example.backend.repository.EmailVerificationRepository;
import com.example.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
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
    private static final long EXPIRY_MINUTES = 10;

    // Send OTP code
    public void sendVerificationCode(String email) throws BadRequestException, MessagingException {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already in use!");
        }

        String code = generateOtp();

        // Remove old code if exists
        verificationRepository.findByEmail(email).ifPresent(verificationRepository::delete);

        // Save new code
        EmailVerification verification = new EmailVerification(email, code);
        verificationRepository.save(verification);

        // Send email
        sendOtpEmail(email, code);
    }

    // Verify OTP code
    public void verifyCode(String email, String code) throws BadRequestException {
        EmailVerification verification = verificationRepository
                .findByEmailAndCodeAndUsedFalse(email, code)
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification code"));

        if (verification.isExpired()) {
            throw new BadRequestException("Verification code has expired");
        }

        // Mark as used
        verification.setUsed(true);
        verificationRepository.save(verification);
    }

    // Check if email is verified (used during registration)
    public void validateEmailVerified(String email) throws BadRequestException {
        boolean verified = verificationRepository
                .findByEmail(email)
                .map(v -> !v.isExpired() && v.isUsed())
                .orElse(false);

        if (!verified) {
            throw new BadRequestException("Email is not verified. Please enter the OTP code.");
        }
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private void sendOtpEmail(String toEmail, String code) throws MessagingException {
        emailService.sendEmail(
                toEmail,
                "Account Verification Code - HotelBooking",
                """
                Hello,

                Your account verification code is:

                %s

                This code is valid for 10 minutes.
                If you did not request this, please ignore this email.

                Best regards,
                HotelBooking Team
                """.formatted(code)
        );
    }
}
