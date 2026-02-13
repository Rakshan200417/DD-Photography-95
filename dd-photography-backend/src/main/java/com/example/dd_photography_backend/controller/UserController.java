package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.dto.LoginRequest;
import com.example.dd_photography_backend.model.User;
import com.example.dd_photography_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email already exists"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }



    // User Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> user = userRepo.findByEmail(request.getEmail());

        if (user.isPresent() && user.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.ok(Map.of("token", "USER_SIMPLE_TOKEN_12345", "message", "Login success"));
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
    }
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

}
