package com.example.backend.service;

import com.example.backend.common.RoleName;
import com.example.backend.common.UserStatus;
import com.example.backend.dto.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.BeanUtilsHelper;
import com.example.backend.utils.SpecUtils;
import com.example.backend.utils.UserSpecification;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       BCryptPasswordEncoder passwordEncoder, JwtService jwtService, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    // ============================= REGISTER =============================

    @Transactional
    public UserResponse registerUser(UserRequest request) {
        logger.info("Attempting to register new user: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            logger.warn("Username already exists: {}", request.getUsername());
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

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setIsActive(true);
        user.setPreferredLanguage(request.getPreferredLanguage());

        try {
            User saved = userRepository.save(user);
            logger.info("User registered successfully: {}", saved.getEmail());
            return mapToResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to register user {}: {}", request.getEmail(), e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to register user");
        }
    }

    // ============================= LOGIN =============================

    @Transactional
    public LoginResponse loginUser(LoginRequest request) {
        logger.info("User attempting login: {}", request.getUsernameOrEmail());

        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed — user not found: {}", request.getUsernameOrEmail());
                    return new ResourceNotFoundException("Invalid username/email or password");
                });

        if (!user.getIsActive()) {
            logger.warn("Inactive account login attempt: {}", user.getEmail());
            throw new IllegalStateException("Account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
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

        String token = jwtService.generateToken(
                user.getUsername(), user.getEmail(), user.getRole().getRoleName().name()
        );

        logger.info("User logged in successfully: {}", user.getEmail());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(mapToResponse(user));

        return response;
    }

    // ============================= GET USER =============================

    public UserResponse getUserById(UUID id) {
        logger.debug("Fetching user by ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] User not found for ID: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        logger.info("User retrieved successfully: {}", user.getEmail());
        return mapToResponse(user);
    }

    public PagedResponse<UserResponse> getAllUsers(int page, int size, String role, String keyword, Boolean isActive) {
        logger.info("Fetching users - page: {}, size: {}, role: {}, keyword: {}, isActive: {}", page, size, role, keyword, isActive);

        Pageable pageable = PageRequest.of(page, size);
        Specification<User> spec = SpecUtils.empty();

        // Filter by role
        if (role != null && !role.isEmpty()) {
            try {
                RoleName roleEnum = RoleName.valueOf(role.toUpperCase());
                spec = spec.and(UserSpecification.hasRole(roleEnum));
                logger.debug("Filtering by role: {}", roleEnum);
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid role provided: {}", role);
                throw new IllegalArgumentException("Invalid role: " + role);
            }
        }

        // Filter by keyword
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and(UserSpecification.keywordContains(keyword));
            logger.debug("Filtering by keyword: {}", keyword);
        }

        // Filter by active status
        if (isActive != null) {
            spec = spec.and(UserSpecification.isActive(isActive));
            logger.debug("Filtering by isActive: {}", isActive);
        }

        // Execute query
        Page<User> pageResult = userRepository.findAll(spec, pageable);
        logger.info("Found {} users (page {}/{})", pageResult.getNumberOfElements(), pageResult.getNumber() + 1, pageResult.getTotalPages());

        List<UserResponse> content = pageResult.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        // Optional detailed logging (DEBUG)
        if (logger.isDebugEnabled()) {
            content.forEach(u -> logger.debug("User: id={}, email={}, role={}", u.getId(), u.getEmail(), u.getRoleName()));
        }

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }

    // ============================= UPDATE =============================

    @Transactional
    public UserResponse updateUser(UUID id, @Valid UserUpdateRequest request) {
        logger.info("Updating user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] User not found for ID: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        // Check email if sent
        if (request.getEmail() != null && !user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                logger.warn("[update] Email already exists: {}", request.getEmail());
                throw new IllegalArgumentException("Email already exists");
            }
            user.setEmail(request.getEmail());
            logger.debug("Updated email for user {} to {}", user.getId(), request.getEmail());
        }

        // Update a role (only admin can change a role)
        String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
        if (request.getRoleName() != null && !user.getRole().getRoleName().equals(request.getRoleName()) && currentRole.contains("ROLE_ADMIN")) {
            Role role = roleRepository.findByRoleName(request.getRoleName())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            user.setRole(role);
            logger.debug("Updated role for user {} to {}", user.getId(), role.getRoleName());
        }

        // Update fields only when data is available
        BeanUtilsHelper.copyNonNullProperties(request, user);

        try {
            User updated = userRepository.save(user);
            logger.info("User updated successfully: {}", user.getEmail());
            return mapToResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update user {}: {}", user.getEmail(), e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to update user by id");
        }
    }

    // ============================= DELETE =============================

    @Transactional
    public void deleteUser(UUID id) {
        logger.warn("Deactivating user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[delete] User not found for ID: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        user.setIsActive(false);

        try {
            userRepository.save(user);
            logger.info("User deactivated successfully: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to deactivate user {}: {}", user.getEmail(), e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to delete user by id");
        }
    }

    // ============================= PASSWORD RESET =============================

    @Transactional
    public PasswordResetResponse requestPasswordReset(PasswordResetRequest request) {
        logger.info("Password reset request for: {}", request.getUsernameOrEmail());

        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> {
                    logger.warn("Password reset request failed — user not found: {}", request.getUsernameOrEmail());
                    return new ResourceNotFoundException("User not found");
                });

        String resetToken = jwtService.generateResetPasswordToken(user.getEmail());
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordExpiry(LocalDateTime.now().plusMinutes(5));
        user.setResetTokenUsed(false);
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
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
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        user.setResetTokenUsed(true);
        userRepository.save(user);

        emailService.sendPasswordChangedEmailAsync(user.getEmail());
        logger.info("Password reset completed successfully for user: {}", user.getEmail());
        return new PasswordResetResponse("Password reset successfully");
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

    // ============================= MAPPER =============================

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setAddress(user.getAddress());
        response.setRoleName(user.getRole().getRoleName());
        response.setProfilePictureUrl(user.getProfilePictureUrl());
        response.setIsActive(user.getIsActive());
        response.setPreferredLanguage(user.getPreferredLanguage());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdateAt(user.getUpdatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        return response;
    }
}
