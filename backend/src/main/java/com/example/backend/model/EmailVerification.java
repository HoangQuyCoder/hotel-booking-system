package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "email_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 6)
    private String code;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    private boolean used = false;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryTime);
    }
}