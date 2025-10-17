package com.example.backend.repository;

import com.example.backend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, UUID> , JpaSpecificationExecutor<Hotel> {
    boolean existsByNameAndCity(String name, String city);
}
