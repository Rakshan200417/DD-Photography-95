package com.example.dd_photography_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.dd_photography_backend.model.Booking;
import com.example.dd_photography_backend.model.User;
import com.example.dd_photography_backend.repository.BookingRepository;
import com.example.dd_photography_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private final String SIMPLE_TOKEN = "MY_SIMPLE_TOKEN_12345";

    // Used by the login page for the email autocomplete list
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email and password are required"));
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "Email already registered"));
        }

        User user = new User();
        user.setUsername(username == null ? "" : username.trim());
        user.setEmail(normalizedEmail);
        user.setPassword(password);
        User saved = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "userId", saved.getId(),
                "username", saved.getUsername(),
                "email", saved.getEmail(),
                "message", "Registration success"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email and password are required"));
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        return ResponseEntity.ok(Map.of(
                "token", SIMPLE_TOKEN,
                "userId", user.getId(),
                "username", user.getUsername() == null ? "" : user.getUsername(),
                "email", user.getEmail(),
                "message", "Login success"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        return userRepository.findById(id).map(user -> {
            // Detach user from any bookings so booking records are preserved
            List<Booking> bookings = bookingRepository.findAll();
            for (Booking b : bookings) {
                if (b.getUser() != null && b.getUser().getId().equals(id)) {
                    b.setUser(null);
                    bookingRepository.save(b);
                }
            }
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully", "id", id));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found with id: " + id)));
    }
}