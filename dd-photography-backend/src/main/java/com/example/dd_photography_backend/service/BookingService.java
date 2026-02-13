package com.example.dd_photography_backend.service;

import com.example.dd_photography_backend.dto.BookingRequest;
import com.example.dd_photography_backend.model.Booking;
import com.example.dd_photography_backend.model.Category;
import com.example.dd_photography_backend.repository.BookingRepository;
import com.example.dd_photography_backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CategoryRepository categoryRepository;

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

        return bookingRepository.save(booking);
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
        return bookingRepository.save(booking);
    }
}
