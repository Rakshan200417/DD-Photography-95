package com.example.dd_photography_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "settings")
@Data
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String currency = "$";

    private String basicPrice = "250";

    private String standardPrice = "550";

    private String premiumPrice = "950";

    private String studioEmail = "ddphotography95@gmail.com";

    private String studioPhone = "+94 77 123 4567";

    private boolean acceptingBookings = true;
}
