package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Long countByStatus(String pending);
}
