package com.example.dd_photography_backend.dto;

import lombok.Data;
import java.time.LocalDate;

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
}
