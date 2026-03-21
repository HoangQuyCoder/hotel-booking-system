package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EmailVerificationResponse {
    private String email;
    private String code;
    private LocalDateTime expiryTime;
}
