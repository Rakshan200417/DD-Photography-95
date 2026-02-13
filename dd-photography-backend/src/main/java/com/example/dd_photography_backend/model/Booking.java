package com.example.dd_photography_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

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
}
