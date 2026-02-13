package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.dto.BookingRequest;
import com.example.dd_photography_backend.model.Booking;
import com.example.dd_photography_backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000") // Keep for specific controller, but Global Config is better
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            Booking createdBooking = bookingService.createBooking(request);
            return ResponseEntity
                    .ok(Map.of("message", "Booking created successfully", "bookingId", createdBooking.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Integer id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Integer id, @RequestBody Map<String, String> update) {
        try {
            String status = update.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }
            bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "Booking status updated"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
