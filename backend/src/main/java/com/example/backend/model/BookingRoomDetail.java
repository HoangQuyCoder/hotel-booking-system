package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "booking_room_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRoomDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "booking_room_detail_id")
    private UUID id;

    // N:1 -> BookingRoom
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_room_id", nullable = false)
    private BookingRoom bookingRoom;

    // N:1 -> Room
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
