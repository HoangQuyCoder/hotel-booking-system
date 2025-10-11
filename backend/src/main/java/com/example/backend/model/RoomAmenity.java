package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "room_amenities")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(name = "is_active")
    private Boolean isActive = true;
}