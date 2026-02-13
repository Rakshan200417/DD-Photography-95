package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.repository.BookingRepository;
import com.example.dd_photography_backend.repository.CarouselRepository;
import com.example.dd_photography_backend.repository.MessageRepository;
import com.example.dd_photography_backend.repository.PhotoRepository;
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

    private final CarouselRepository carouselRepo;
    private final BookingRepository bookingRepo;
    private final MessageRepository messageRepo;
    private final PhotoRepository photoRepo;

    public AdminDashboardController(
            CarouselRepository carouselRepo,
            BookingRepository bookingRepo,
            MessageRepository messageRepo,
            PhotoRepository photoRepo
    ) {
        this.carouselRepo = carouselRepo;
        this.bookingRepo = bookingRepo;
        this.messageRepo = messageRepo;
        this.photoRepo = photoRepo;
    }

    @GetMapping
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("carouselCount", carouselRepo.count());
        stats.put("photoCount", photoRepo.count());
        stats.put("bookingCount", bookingRepo.count());
        stats.put("pendingBookings", bookingRepo.countByStatus("PENDING"));
        stats.put("messageCount", messageRepo.count());
        stats.put("unreadMessages", messageRepo.countByReadStatus(false));
        return stats;
    }
}
