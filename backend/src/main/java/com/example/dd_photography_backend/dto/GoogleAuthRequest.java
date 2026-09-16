package com.example.dd_photography_backend.dto;

import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String idToken;
    private String email;
    private String name;
    private String picture;
}
