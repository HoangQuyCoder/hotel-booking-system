package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "room_amenities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomAmenity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "amenity_id")
    private UUID id;

    // N: 1 relationship with RoomType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "category", length = 50)
    private String category;

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