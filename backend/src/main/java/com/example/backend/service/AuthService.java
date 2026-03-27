package com.example.backend.service;

import com.example.backend.common.RoleName;
import com.example.backend.common.UserStatus;
import com.example.backend.dto.request.*;
import com.example.backend.dto.response.ResetPasswordResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public UserResponse login(LoginRequest request) {
        logger.info("User attempting login: {}", request.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.user();

            if (!user.getIsActive()) {
                throw new IllegalStateException("Account is inactive");
            }

            if (user.getLockedUntil() != null &&
                    user.getLockedUntil().isAfter(LocalDateTime.now())) {
                throw new IllegalStateException("Account is temporarily locked");
            }

            user.setFailedLoginAttempts(0);
            user.setLockedUntil(null);
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            logger.info("User logged in successfully: {}", user.getEmail());

            return userMapper.toResponse(user);

        } catch (BadCredentialsException e) {
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);

            if (user != null) {
                user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

                if (user.getFailedLoginAttempts() >= 10) {
                    user.setLockedUntil(LocalDateTime.now().plusMinutes(5));
                    logger.warn("Account locked due to too many failed attempts: {}", user.getEmail());
                }

                userRepository.save(user);
            }

            throw new ResourceNotFoundException("Invalid username/email or password");
        }
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        logger.info("Attempting to register new user: {}", request.getEmail());

        emailService.validateEmailVerified(request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Email already exists: {}", request.getEmail());
            throw new BadRequestException("Email already exists");
        }

        RoleName roleName = request.getRoleName() != null
                ? request.getRoleName()
                : RoleName.CLIENT;

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> {
                    logger.error("Role not found for name: {}", roleName);
                    return new ResourceNotFoundException("Role not found");
                });

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setResetTokenUsed(false);

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    // ============================= PASSWORD RESET =============================

    @Transactional
    public ResetPasswordResponse requestPasswordReset(ForgotPasswordRequest request) {
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

        userRepository.save(user);
        notificationService.sendPasswordResetEmail(user.getEmail(), resetToken);
        logger.info("Password reset email sent to: {}", user.getEmail());
        return new ResetPasswordResponse("Password reset email sent successfully");
    }

    @Transactional
    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        logger.info("Resetting password using token");

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            logger.warn("Password confirmation mismatch");
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = getUserByValidResetToken(request.getToken());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        user.setResetTokenUsed(true);

        userRepository.save(user);
        notificationService.sendPasswordChangedEmail(user.getEmail());
        logger.info("Password reset completed successfully for user: {}", user.getEmail());
        return new ResetPasswordResponse("Password reset successfully");
    }

    public ResetPasswordResponse validateResetToken(ValidateResetTokenRequest request) {
        logger.debug("Validating reset token: {}", request.getToken());
        User user = getUserByValidResetToken(request.getToken());
        logger.info("Reset token is valid for user: {}", user.getEmail());
        return new ResetPasswordResponse("Reset token is valid");
    }

    private User getUserByValidResetToken(String token) {
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
