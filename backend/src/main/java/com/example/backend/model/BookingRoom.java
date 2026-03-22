package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "booking_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "booking_room_id")
    private UUID id;

    // N:1 Relationship with Booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // N:1 Relationship with RoomType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price_per_night", nullable = false)
    private Double pricePerNight;

    @OneToMany(mappedBy = "bookingRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingRoomDetail> bookingRoomDetails;

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
