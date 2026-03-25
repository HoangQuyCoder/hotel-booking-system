package com.example.backend.model;

import com.example.backend.common.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID id;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "preferred_language", length = 10)
    private String preferredLanguage;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.PENDING;

    @Builder.Default
    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_expiry")
    private LocalDateTime resetPasswordExpiry;

    @Builder.Default
    @Column(name = "reset_token_used", nullable = false)
    private Boolean resetTokenUsed = false;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 1: N relationship with Hotel
    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Hotel> hotels;

    // N:1 relationship with Role
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // 1: N relationship with Booking
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;

    // 1: N relationship with NotificationLog
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotificationLog> notifications;

    public boolean isEnabled() {
        if (status == UserStatus.LOCKED_TEMP && lockedUntil != null) {
            if (LocalDateTime.now().isAfter(lockedUntil)) {
                // Lock expired → auto unlock
                this.status = UserStatus.ACTIVE;
                this.lockedUntil = null;
                this.failedLoginAttempts = 0;
                return true;
            }
            return false;
        }
        return status == UserStatus.ACTIVE || status == UserStatus.PENDING;
    }

    public boolean isLocked() {
        return status == UserStatus.LOCKED_TEMP
                || status == UserStatus.LOCKED_PERMANENT
                || status == UserStatus.BANNED;
    }
}
