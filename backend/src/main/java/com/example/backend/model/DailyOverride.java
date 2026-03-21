package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "daily_overrides")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyOverride {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "override_id")
    private UUID id;

    // N:1 Relationship with RoomType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "price_adjustment")
    private Double priceAdjustment;

    @Column(name = "available_rooms")
    private Integer availableRooms;

    @Column(name = "reason")
    private String reason;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}