package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.repository.BookingRepository;
import com.example.dd_photography_backend.repository.UserRepository;
import com.example.dd_photography_backend.repository.GalleryImageRepository;
import com.example.dd_photography_backend.repository.CategoryRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminDashboardController {

    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final GalleryImageRepository galleryImageRepo;
    private final CategoryRepository categoryRepo;

    public AdminDashboardController(
            BookingRepository bookingRepo,
            UserRepository userRepo,
            GalleryImageRepository galleryImageRepo,
            CategoryRepository categoryRepo) {
        this.bookingRepo = bookingRepo;
        this.userRepo = userRepo;
        this.galleryImageRepo = galleryImageRepo;
        this.categoryRepo = categoryRepo;
    }

    @GetMapping
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();

        // Gallery (images) Stats - counts the gallery images used by the public gallery
        stats.put("galleryCount", galleryImageRepo.count());

        // Category Stats - booking categories
        stats.put("categoryCount", categoryRepo.count());

        // Booking Stats
        stats.put("totalBookings", bookingRepo.count()); // Renamed key to match frontend
        stats.put("pendingBookings", bookingRepo.countByStatus("PENDING"));
        stats.put("confirmedBookings", bookingRepo.countByStatus("CONFIRMED"));
        stats.put("cancelledBookings", bookingRepo.countByStatus("CANCELLED"));

        // User Stats (replaces messaging)
        stats.put("totalUsers", userRepo.count());

        return stats;
    }
}
