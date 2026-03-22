package com.example.backend.repository;

import com.example.backend.common.RoomStatus;
import com.example.backend.model.Room;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID>, JpaSpecificationExecutor<Room> {
    boolean existsByRoomNumberAndRoomTypeId(String roomNumber, UUID roomTypeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.roomType.id = :roomTypeId AND r.status = 'AVAILABLE'")
    List<Room> findAvailableRoomsForUpdate(UUID roomTypeId);
}