package com.example.dd_photography_backend.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.dd_photography_backend.dto.GoogleAuthRequest;
import com.example.dd_photography_backend.dto.LoginRequest;
import com.example.dd_photography_backend.model.AdminUser;
import com.example.dd_photography_backend.model.User;
import com.example.dd_photography_backend.repository.AdminUserRepository;
import com.example.dd_photography_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdminUserRepository adminUserRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private com.example.dd_photography_backend.service.EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${app.admin.email:dhilshanmohamed2002@gmail.com}")
    private String adminEmail;

    private final String SIMPLE_TOKEN = "MY_SIMPLE_TOKEN_12345";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String identifier = request.getUsername() != null && !request.getUsername().isBlank()
                ? request.getUsername().trim()
                : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        if (identifier.isEmpty() || password.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("error", "Username/Email and password are required"));
        }

        // 1. Check if identifier belongs to an AdminUser (by username or email)
        AdminUser admin = adminUserRepo.findByUsername(identifier);
        if (admin == null) {
            admin = adminUserRepo.findByEmailIgnoreCase(identifier).orElse(null);
        }
        if (admin != null && admin.getPassword() != null && admin.getPassword().equals(password)) {
            System.out.println("[AUTH] Successfully authenticated ADMIN: " + admin.getUsername());

            // Auto-populate default email if not yet set
            if (admin.getEmail() == null || admin.getEmail().isBlank()) {
                if ("Rakshan".equalsIgnoreCase(admin.getUsername())) {
                    admin.setEmail("dhilshanmohamed2002@gmail.com");
                } else if ("admin".equalsIgnoreCase(admin.getUsername())) {
                    admin.setEmail("admin@gmail.com");
                }
                adminUserRepo.save(admin);
            }

            // Dispatch admin login security notification email asynchronously
            String targetAdminEmail = (admin.getEmail() != null && !admin.getEmail().isBlank())
                    ? admin.getEmail()
                    : ((adminEmail != null && !adminEmail.isBlank()) ? adminEmail : "dhilshanmohamed2002@gmail.com");
            emailService.sendLoginNotificationEmail(targetAdminEmail, admin.getUsername(), "ADMIN");

            return ResponseEntity.ok(Map.of(
                    "role", "ADMIN",
                    "token", SIMPLE_TOKEN,
                    "username", admin.getUsername(),
                    "email", admin.getEmail() != null ? admin.getEmail() : "",
                    "message", "Admin login success"
            ));
        }

        // 2. Check if identifier belongs to a regular User (by email or username)
        User user = userRepo.findByEmail(identifier.toLowerCase())
                .or(() -> userRepo.findAll().stream().filter(u -> identifier.equalsIgnoreCase(u.getUsername())).findFirst())
                .orElse(null);

        if (user != null && user.getPassword() != null && user.getPassword().equals(password)) {
            if (user.getIsVerified() != null && !user.getIsVerified()) {
                return ResponseEntity.status(403).body(Map.of("error", "Please verify your email first.", "requiresOtp", true));
            }

            System.out.println("[AUTH] Successfully authenticated USER: " + user.getEmail());

            // Send login notification to the USER
            emailService.sendLoginNotificationEmail(user.getEmail(), user.getUsername() != null ? user.getUsername() : user.getEmail(), "USER");

            // Send login alert notification email to ALL admins
            List<AdminUser> allAdmins = adminUserRepo.findAll();
            for (AdminUser a : allAdmins) {
                String aEmail = (a.getEmail() != null && !a.getEmail().isBlank()) ? a.getEmail() : adminEmail;
                if (aEmail != null && !aEmail.isBlank()) {
                    emailService.sendAdminUserLoginAlert(aEmail, user.getUsername() != null ? user.getUsername() : user.getEmail(), user.getEmail());
                }
            }

            return ResponseEntity.ok(Map.of(
                    "role", "USER",
                    "token", SIMPLE_TOKEN,
                    "userId", user.getId(),
                    "username", user.getUsername() != null ? user.getUsername() : "",
                    "email", user.getEmail(),
                    "message", "User login success"
            ));
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid username/email or password"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest request) {
        String idToken = request.getIdToken();
        String email = request.getEmail();
        String name = request.getName();
        String picture = request.getPicture();

        // 1. If an idToken is provided, decode payload directly (fail-safe and instant)
        if (idToken != null && !idToken.isBlank()) {
            try {
                String[] parts = idToken.split("\\.");
                if (parts.length >= 2) {
                    byte[] decoded = java.util.Base64.getUrlDecoder().decode(parts[1]);
                    String payloadStr = new String(decoded, java.nio.charset.StandardCharsets.UTF_8);
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    @SuppressWarnings("unchecked")
                    Map<String, Object> jwtMap = mapper.readValue(payloadStr, Map.class);
                    if (jwtMap.containsKey("email")) {
                        email = (String) jwtMap.get("email");
                    }
                    if (jwtMap.containsKey("name")) {
                        name = (String) jwtMap.get("name");
                    }
                    if (jwtMap.containsKey("picture")) {
                        picture = (String) jwtMap.get("picture");
                    }
                }
            } catch (Exception parseEx) {
                System.out.println("[AUTH] JWT payload parse note: " + parseEx.getMessage());
            }

            // Also attempt online Google tokeninfo verification if needed
            if (email == null || email.isBlank()) {
                try {
                    RestTemplate restTemplate = new RestTemplate();
                    String verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
                    @SuppressWarnings("unchecked")
                    Map<String, Object> tokenInfo = restTemplate.getForObject(verifyUrl, Map.class);
                    if (tokenInfo != null && tokenInfo.containsKey("email")) {
                        email = (String) tokenInfo.get("email");
                        if (tokenInfo.containsKey("name")) {
                            name = (String) tokenInfo.get("name");
                        }
                        if (tokenInfo.containsKey("picture")) {
                            picture = (String) tokenInfo.get("picture");
                        }
                    }
                } catch (Exception e) {
                    System.err.println("[AUTH] Google online tokeninfo lookup notice: " + e.getMessage());
                }
            }
        }

        if (email == null || email.isBlank()) {
            return ResponseEntity.status(400).body(Map.of("error", "Google email is required"));
        }

        email = email.trim().toLowerCase();
        String safeName = (name != null && !name.isBlank()) ? name.trim() : email.split("@")[0];

        // 2. Check if this is the Studio Administrator
        String effectiveAdminEmail = (adminEmail != null && !adminEmail.isBlank())
                ? adminEmail.trim().toLowerCase()
                : "dhilshanmohamed2002@gmail.com";
        boolean isAdmin = email.equalsIgnoreCase(effectiveAdminEmail)
                || "dhilshanmohamed2002@gmail.com".equalsIgnoreCase(email)
                || "admin@gmail.com".equalsIgnoreCase(email)
                || adminUserRepo.findByEmailIgnoreCase(email).isPresent();

        if (isAdmin) {
            System.out.println("[AUTH] Google Sign-In recognized ADMIN: " + email);
            emailService.sendLoginNotificationEmail(email, safeName, "ADMIN");
            return ResponseEntity.ok(Map.of(
                    "role", "ADMIN",
                    "token", SIMPLE_TOKEN,
                    "username", safeName,
                    "email", email,
                    "picture", picture != null ? picture : "",
                    "message", "Admin Google login success"
            ));
        }

        // 3. User Sign-In or Auto-Registration
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(safeName);
            user.setPassword("GOOGLE_OAUTH_" + UUID.randomUUID().toString());
            user.setIsVerified(true); // Auto-verify Google users
            user = userRepo.save(user);
            System.out.println("[AUTH] Auto-registered new user via Google: " + email);
        } else if (user.getUsername() != null && !user.getUsername().isBlank()) {
            safeName = user.getUsername();
        }

        // Send login notification to the USER
        emailService.sendLoginNotificationEmail(user.getEmail(), safeName, "USER");

        // Send login alert notification email to ALL admins
        List<AdminUser> allAdmins = adminUserRepo.findAll();
        for (AdminUser a : allAdmins) {
            String aEmail = (a.getEmail() != null && !a.getEmail().isBlank()) ? a.getEmail() : adminEmail;
            if (aEmail != null && !aEmail.isBlank()) {
                emailService.sendAdminUserLoginAlert(aEmail, safeName, user.getEmail());
            }
        }

        return ResponseEntity.ok(Map.of(
                "role", "USER",
                "token", SIMPLE_TOKEN,
                "userId", user.getId(),
                "username", safeName,
                "email", user.getEmail(),
                "picture", picture != null ? picture : "",
                "message", "User Google login success"
        ));
    }

    // List all admin users (for Admin Settings)
    @GetMapping("/all")
    public ResponseEntity<?> getAllAdmins() {
        try {
            return ResponseEntity.ok(adminUserRepo.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Unable to fetch admins"));
        }
    }

    // Update an Admin's email address
    @PutMapping("/admins/{id}/email")
    public ResponseEntity<?> updateAdminEmail(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String newEmail = body.get("email");
        if (newEmail == null || newEmail.isBlank()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email is required"));
        }
        Optional<AdminUser> opt = adminUserRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Admin user not found"));
        }
        AdminUser a = opt.get();
        a.setEmail(newEmail.trim().toLowerCase());
        adminUserRepo.save(a);
        return ResponseEntity.ok(Map.of("message", "Admin email updated successfully", "admin", a));
    }

    @jakarta.annotation.PostConstruct
    public void initAdminEmails() {
        try {
            AdminUser admin = adminUserRepo.findByUsername("admin");
            if (admin != null && (admin.getEmail() == null || admin.getEmail().isBlank())) {
                admin.setEmail("admin@gmail.com");
                adminUserRepo.save(admin);
            }
            AdminUser rakshan = adminUserRepo.findByUsername("Rakshan");
            if (rakshan != null && (rakshan.getEmail() == null || rakshan.getEmail().isBlank() || rakshan.getEmail().equals("kukarakshan2004@gmail.com"))) {
                rakshan.setEmail("dhilshanmohamed2002@gmail.com");
                adminUserRepo.save(rakshan);
            }
        } catch (Exception e) {
            System.err.println("Note: Could not auto-populate admin emails on init: " + e.getMessage());
        }
    }

    // Test email endpoint
    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail(@org.springframework.web.bind.annotation.RequestParam(defaultValue = "dhilshanmohamed2002@gmail.com") String to) {
        String result = emailService.sendTestEmailSync(to);
        boolean isSuccess = result.startsWith("SUCCESS");
        return ResponseEntity.status(isSuccess ? 200 : 500).body(Map.of(
                "result", result,
                "to", to,
                "success", isSuccess
        ));
    }
}
