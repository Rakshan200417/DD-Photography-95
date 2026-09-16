package com.example.dd_photography_backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String phone;

    @Column(name = "event_date")
    private LocalDate eventDate;

    private String message;
    private String packageType;
    private String price;
    private String status;

    // ✅ FK relation
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Link booking to a user (optional in DB but required for creating a booking through API)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
