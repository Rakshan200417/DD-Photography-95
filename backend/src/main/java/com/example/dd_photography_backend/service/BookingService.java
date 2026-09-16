package com.example.dd_photography_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dd_photography_backend.dto.BookingRequest;
import com.example.dd_photography_backend.model.Booking;
import com.example.dd_photography_backend.model.Category;
import com.example.dd_photography_backend.model.Setting;
import com.example.dd_photography_backend.model.User;
import com.example.dd_photography_backend.repository.BookingRepository;
import com.example.dd_photography_backend.repository.CategoryRepository;
import com.example.dd_photography_backend.repository.SettingRepository;
import com.example.dd_photography_backend.repository.UserRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private EmailService emailService;

    public Booking createBooking(BookingRequest request) {
        if (request.getCategoryId() == null) {
             throw new IllegalArgumentException("Category ID cannot be null");
        }
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));

        Booking booking = new Booking();
        booking.setName(request.getName());
        booking.setEmail(request.getEmail());
        booking.setPhone(request.getPhone());
        booking.setEventDate(request.getEventDate());
        booking.setMessage(request.getMessage());
        booking.setPackageType(request.getPackageType());
        booking.setPrice(request.getPrice());
        booking.setStatus("PENDING");
        booking.setCategory(category);

        // Associate booking with user if user exists (by ID or fallback to email)
        if (request.getUserId() != null) {
            userRepository.findById(request.getUserId()).ifPresent(booking::setUser);
        }
        if (booking.getUser() == null && request.getEmail() != null && !request.getEmail().isBlank()) {
            userRepository.findByEmail(request.getEmail().trim().toLowerCase()).ifPresent(booking::setUser);
        }

        Booking savedBooking = bookingRepository.save(booking);

        // Notify Admin via Email (specifically to dhilshanmohamed2002@gmail.com)
        String adminEmail = "dhilshanmohamed2002@gmail.com";
        
        emailService.sendNewBookingAdminNotification(
                adminEmail,
                savedBooking.getName(),
                savedBooking.getPackageType(),
                savedBooking.getEventDate() != null ? savedBooking.getEventDate().toString() : "N/A",
                String.valueOf(savedBooking.getId())
        );

        return savedBooking;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Integer id) {
        return bookingRepository.findById(id);
    }

    public Booking updateBookingStatus(Integer id, String status) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);

        // Fetch Studio contact info from Settings
        Setting setting = settingRepository.findAll().stream().findFirst().orElseGet(Setting::new);
        String studioPhone = setting.getStudioPhone() != null ? setting.getStudioPhone() : "+94 77 123 4567";
        String studioEmail = setting.getStudioEmail() != null ? setting.getStudioEmail() : "ddphotography95@gmail.com";

        // Send email confirmation/rejection to client with contact details
        if (booking.getEmail() != null && !booking.getEmail().isBlank()) {
            String eventDateStr = booking.getEventDate() != null ? booking.getEventDate().toString() : "your scheduled date";
            String packageStr = booking.getPackageType() != null ? booking.getPackageType().toUpperCase() : "Photo Session";

            emailService.sendBookingStatusEmail(
                    booking.getEmail().trim(),
                    booking.getName(),
                    status,
                    packageStr,
                    eventDateStr,
                    studioPhone,
                    studioEmail
            );
        }

        return saved;
    }
}
