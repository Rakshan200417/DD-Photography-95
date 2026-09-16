package com.example.dd_photography_backend.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class BookingRequest {
    private String name;
    private String email;
    private String phone;
    private LocalDate eventDate;
    private String message;
    private String packageType;
    private String price;
    private Integer categoryId; // ✅ Use categoryId instead of categoryName
    private Integer userId; // ID of the logged-in user - required
}
