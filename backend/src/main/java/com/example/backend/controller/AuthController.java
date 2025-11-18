package com.example.backend.controller;

import com.example.backend.dto.request.*;
import com.example.backend.dto.response.AuthResponse;
import com.example.backend.dto.response.PasswordResetResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.service.AuthService;
import com.example.backend.service.JwtService;
import com.example.backend.utils.JwtCookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    private final JwtService jwtService;
    private final JwtCookieUtil jwtCookieUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request,
                                      HttpServletResponse response) {

        UserResponse newUser = authService.register(request);

        // Registered → auto login
        String token = jwtService.generateToken(
                newUser.getEmail(),
                newUser.getRoleName().name()
        );

        jwtCookieUtil.addJwtCookie(response, token);

        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletResponse response) {

        AuthResponse res = authService.login(request);

        jwtCookieUtil.addJwtCookie(response, res.getToken());

        return ResponseEntity.ok(res);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        jwtCookieUtil.clearJwtCookie(response);
        return ResponseEntity.ok("Logged out");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetResponse> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(authService.requestPasswordReset(request));
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<PasswordResetResponse> validateResetToken(@Valid @RequestBody ValidateResetTokenRequest request) {
        return ResponseEntity.ok(authService.validateResetToken(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
