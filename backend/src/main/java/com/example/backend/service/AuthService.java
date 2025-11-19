package com.example.backend.service;

import com.example.backend.common.UserStatus;
import com.example.backend.dto.request.*;
import com.example.backend.dto.response.PasswordResetResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationService notificationService;
    private final EmailVerificationService emailVerificationService;
    private final UserMapper userMapper;

    @Transactional
    public UserResponse login(LoginRequest request) {
        logger.info("User attempting login: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed — user not found: {}", request.getEmail());
                    return new ResourceNotFoundException("Invalid username/email or password");
                });

        if (!user.getIsActive()) {
            logger.warn("Inactive account login attempt: {}", user.getEmail());
            throw new IllegalStateException("Account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Incorrect password for user: {}", user.getEmail());
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 10) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(1));
                logger.warn("Account locked for 1 hour due to too many failed attempts: {}", user.getEmail());
            }
            userRepository.save(user);
            throw new ResourceNotFoundException("Invalid username/email or password");
        }

        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        logger.info("User logged in successfully: {}", user.getEmail());

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse register(RegisterRequest request) throws BadRequestException {
        logger.info("Attempting to register new user: {}", request.getEmail());
        emailVerificationService.validateEmailVerified(request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Username already exists: {}", request.getEmail());
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("[registerUser] Email already exists: {}", request.getEmail());
            throw new IllegalArgumentException("Email already exists");
        }

        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> {
                    logger.error("Role not found for name: {}", request.getRoleName());
                    return new ResourceNotFoundException("Role not found");
                });

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(role)
                .status(UserStatus.ACTIVE)
                .isActive(true)
                .build();

        try {
            User saved = userRepository.save(user);
            notificationService.sendRegisterSuccessEmail(saved);
            logger.info("User registered successfully: {}", saved.getEmail());
            return userMapper.toResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to register user {}: {}", request.getEmail(), e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to register user");
        }
    }

    // ============================= PASSWORD RESET =============================

    @Transactional
    public PasswordResetResponse requestPasswordReset(PasswordResetRequest request) {
        logger.info("Password reset request for: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Password reset request failed — user not found: {}", request.getEmail());
                    return new ResourceNotFoundException("User not found");
                });

        String resetToken = jwtService.generateResetPasswordToken(user.getEmail());
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordExpiry(LocalDateTime.now().plusMinutes(5));
        user.setResetTokenUsed(false);

        try {
            userRepository.save(user);
            notificationService.sendPasswordResetEmail(user.getEmail(), resetToken);
            logger.info("Password reset email sent to: {}", user.getEmail());
            return new PasswordResetResponse("Password reset email sent successfully");
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Transactional
    public PasswordResetResponse resetPassword(ResetPasswordRequest request) {
        logger.info("Resetting password using token");

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            logger.warn("Password confirmation mismatch");
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = validateResetToken(request.getToken());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        user.setResetTokenUsed(true);

        try {
            userRepository.save(user);
            notificationService.sendPasswordChangedEmail(user.getEmail());
            logger.info("Password reset completed successfully for user: {}", user.getEmail());
            return new PasswordResetResponse("Password reset successfully");
        } catch (MessagingException e) {
            logger.error("Failed to send password reset completed successfully email to {}: {}", user.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Failed to send password reset completed successfully email", e);
        }
    }

    public PasswordResetResponse validateResetToken(ValidateResetTokenRequest request) {
        logger.debug("Validating reset token: {}", request.getToken());
        User user = validateResetToken(request.getToken());
        logger.info("Reset token is valid for user: {}", user.getEmail());
        return new PasswordResetResponse("Reset token is valid");
    }

    private User validateResetToken(String token) {
        if (!jwtService.isResetTokenValid(token)) {
            logger.warn("Invalid or expired reset token");
            throw new IllegalArgumentException("Invalid or expired reset token");
        }

        return userRepository.findByValidResetPasswordToken(token)
                .orElseThrow(() -> {
                    logger.error("No user found for reset token");
                    return new ResourceNotFoundException("Invalid or expired reset token");
                });
    }
}
