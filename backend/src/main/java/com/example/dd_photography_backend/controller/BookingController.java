package com.example.dd_photography_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dd_photography_backend.dto.BookingRequest;
import com.example.dd_photography_backend.model.Booking;
import com.example.dd_photography_backend.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        System.out.println("[DEBUG] /api/bookings POST payload: userId=" + request.getUserId() + " categoryId=" + request.getCategoryId());
        try {
            Booking createdBooking = bookingService.createBooking(request);
            System.out.println("[DEBUG] Booking created id=" + createdBooking.getId());
            return ResponseEntity.ok(Map.of("message", "Booking created successfully", "bookingId", createdBooking.getId()));
        } catch (RuntimeException e) {
            e.printStackTrace();
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("user must be logged in")) {
                return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
            }
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

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatusByQuery(@PathVariable Integer id, @RequestParam String status) {
        try {
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }
            bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "Booking status updated"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Integer id, @RequestBody(required = false) Map<String, String> update) {
        try {
            String status = update != null ? update.get("status") : null;
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }
            bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "Booking status updated"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
