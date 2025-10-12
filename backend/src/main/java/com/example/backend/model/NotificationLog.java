package com.example.backend.model;

import com.example.backend.common.NotificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "log_id")
    private UUID id;

    @Column(name = "recipient", nullable = false, length = 255)
    private String recipient;

    // N:1 Relationship with NotificationTemplate
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private NotificationTemplate template;

    @Column(name = "status", nullable = false, length = 50)
    private NotificationStatus status;

    @Column(name = "source_event", length = 100)
    private String sourceEvent;

    @Column(name = "metadata", columnDefinition = "JSONB")
    private String metadata;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "booking_id")
    private UUID bookingId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
