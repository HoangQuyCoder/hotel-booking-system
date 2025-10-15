package com.example.backend.service;

import com.example.backend.common.RoleName;
import com.example.backend.common.UserStatus;
import com.example.backend.dto.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.SpecUtils;
import com.example.backend.util.UserSpecification;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @Transactional
    public UserResponse registerUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

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
            return mapToResponse(saved);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Failed to register user");
        }
    }

    @Transactional
    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username/email or password"));

        if (!user.getIsActive()) {
            throw new IllegalStateException("Account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5) {
                user.setLockedUntil(LocalDateTime.now().plusHours(1));
            }
            userRepository.save(user);
            throw new ResourceNotFoundException("Invalid username/email or password");
        }

        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername(), user.getEmail(), user.getRole().getRoleName().name());
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(mapToResponse(user));
        try {
            return response;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Failed to login user");
        }
    }

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        try {
            return mapToResponse(user);
        } catch (Exception e) {
            logger.error("Failed to get user by id: {}", e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to get user by id");
        }
    }

    @Transactional
    public UserResponse updateUser(UUID id, @Valid UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Only ADMIN can change roles
        String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
        if (request.getRoleId() != null && !user.getRole().getId().equals(request.getRoleId()) && currentRole.contains("ROLE_ADMIN")) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            user.setRole(role);
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setPreferredLanguage(request.getPreferredLanguage());
        user.setUpdatedAt(LocalDateTime.now());

        try {
            User updated = userRepository.save(user);
            return mapToResponse(updated);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Failed to update user by id");
        }
    }

    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(false);
        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Failed to delete user by id");
        }
    }

    public PagedResponse<UserResponse> getAllUsers(int page, int size, String role, String keyword, Boolean isActive) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<User> spec = SpecUtils.empty();

        // Filter by role
        if (role != null && !role.isEmpty()) {
            try {
                RoleName roleEnum = RoleName.valueOf(role.toUpperCase());
                spec = spec.and(UserSpecification.hasRole(roleEnum));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid role: " + role);
            }
        }

        // Filter by keyword (username, email, firstname, lastname)
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and(UserSpecification.keywordContains(keyword));
        }

        // Filter by account is deleted or not
        if (isActive != null) {
            spec = spec.and(UserSpecification.isActive(isActive));
        }

        Page<User> pageResult = userRepository.findAll(spec, pageable);

        List<UserResponse> content = pageResult.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }

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
        response.setIsActive(user.getIsActive());
        response.setPreferredLanguage(user.getPreferredLanguage());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        return response;
    }

    @Transactional
    public PasswordResetResponse requestPasswordReset(PasswordResetRequest request) {
        logger.info("Processing password reset request for: {}", request.getUsernameOrEmail());

        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> {
                    logger.error("User not found: {}", request.getUsernameOrEmail());
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
            logger.error("Failed to send password reset email: {}", e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public PasswordResetResponse validateResetToken(ValidateResetTokenRequest request) {
        logger.info("Validating reset token: {}", request.getToken());
        User user = validateResetToken(request.getToken());

        logger.info("Reset token validated for user: {}", user.getEmail());
        return new PasswordResetResponse("Reset token is valid");
    }

    @Transactional
    public PasswordResetResponse resetPassword(ResetPasswordRequest request) {
        logger.info("Processing password reset with token");

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            logger.error("Passwords do not match");
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = validateResetToken(request.getToken());

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        user.setResetTokenUsed(true);
        userRepository.save(user);

        // Continue even if email fails
        try {
            emailService.sendPasswordChangedEmail(user.getEmail());
            logger.info("Password changed email sent to: {}", user.getEmail());
        } catch (MessagingException e) {
            logger.warn("Failed to send password changed email: {}", e.getMessage());
        }

        logger.info("Password reset successfully for user: {}", user.getEmail());
        return new PasswordResetResponse("Password reset successfully");
    }

    private User validateResetToken(String token) {
        if (!jwtService.isResetTokenValid(token)) {
            logger.error("Invalid or expired reset token");
            throw new IllegalArgumentException("Invalid or expired reset token");
        }

        return userRepository.findByValidResetPasswordToken(token)
                .orElseThrow(() -> {
                    logger.error("No user found with valid reset token");
                    return new ResourceNotFoundException("Invalid or expired reset token");
                });
    }
}