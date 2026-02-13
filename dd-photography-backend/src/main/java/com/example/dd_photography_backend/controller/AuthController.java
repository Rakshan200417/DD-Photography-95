package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.dto.LoginRequest;
import com.example.dd_photography_backend.model.AdminUser;
import com.example.dd_photography_backend.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AdminUserRepository adminUserRepo;

    private final String SIMPLE_TOKEN = "MY_SIMPLE_TOKEN_12345";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        AdminUser admin = adminUserRepo.findByUsername(request.getUsername());

        if (admin != null && admin.getPassword().equals(request.getPassword())) {
            return ResponseEntity.ok(
                    Map.of(
                            "token", SIMPLE_TOKEN,
                            "message", "Login success"
                    )
            );
        }

        return ResponseEntity.status(401).body(
                Map.of("error", "Invalid username or password")
        );
    }
}
