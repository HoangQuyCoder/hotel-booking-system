package com.example.backend.controller;

import com.example.backend.dto.request.*;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PasswordResetResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.service.AuthService;
import com.example.backend.service.EmailService;
import com.example.backend.service.JwtService;
import com.example.backend.service.NotificationService;
import com.example.backend.utils.JwtCookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final JwtCookieUtil jwtCookieUtil;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {

        UserResponse newUser = authService.register(request);

        // Auto login after register
        String token = jwtService.generateToken(newUser.getEmail(), newUser.getRoleName().name());
        jwtCookieUtil.addJwtCookie(response, token);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registered successfully!", newUser));
    }

    // SEND CODE
    @PostMapping("/send-code")
    public ResponseEntity<ApiResponse<Void>> sendCode(
            @Valid @RequestBody EmailRequest request) {

        notificationService.sendEmailVerificationCode(request.getEmail());

        return ResponseEntity.ok(
                ApiResponse.ok("Verification code has been sent to your email")
        );
    }

    // VERIFY CODE
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<Void>> verifyCode(
            @Valid @RequestBody VerifyCodeRequest request) {

        emailService.verifyCode(request.getEmail(), request.getCode());

        return ResponseEntity.ok(
                ApiResponse.ok("Verification successful! You can continue.")
        );
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        UserResponse userResponse = authService.login(request);

        String token = jwtService.generateToken(userResponse.getEmail(), userResponse.getRoleName().name());
        jwtCookieUtil.addJwtCookie(response, token);

        return ResponseEntity.ok(
                ApiResponse.success("Log in successfully!", userResponse)
        );
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        jwtCookieUtil.clearJwtCookie(response);
        return ResponseEntity.ok(
                ApiResponse.ok("Signed out successfully")
        );
    }

    // REQUEST PASSWORD RESET
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<PasswordResetResponse>> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequest request) {

        PasswordResetResponse res = authService.requestPasswordReset(request);

        return ResponseEntity.ok(
                ApiResponse.success("Password recovery email has been sent", res)
        );
    }

    // VALIDATE RESET TOKEN
    @PostMapping("/validate-reset-token")
    public ResponseEntity<ApiResponse<PasswordResetResponse>> validateResetToken(
            @Valid @RequestBody ValidateResetTokenRequest request) {

        PasswordResetResponse res = authService.validateResetToken(request);

        return ResponseEntity.ok(
                ApiResponse.success("Valid tokens", res)
        );
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<PasswordResetResponse>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        PasswordResetResponse res = authService.resetPassword(request);

        return ResponseEntity.ok(
                ApiResponse.success("Password reset successful", res)
        );
    }
}