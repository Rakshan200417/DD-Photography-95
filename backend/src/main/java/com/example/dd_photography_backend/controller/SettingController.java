package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.model.Setting;
import com.example.dd_photography_backend.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SettingController {

    @Autowired
    private SettingRepository settingRepository;

    @GetMapping
    public ResponseEntity<Setting> getSettings() {
        Setting setting = settingRepository.findAll().stream().findFirst().orElseGet(() -> {
            Setting initial = new Setting();
            return settingRepository.save(initial);
        });
        return ResponseEntity.ok(setting);
    }

    @PutMapping
    public ResponseEntity<Setting> updateSettings(@RequestBody Setting updated) {
        Setting setting = settingRepository.findAll().stream().findFirst().orElseGet(Setting::new);

        if (updated.getCurrency() != null && !updated.getCurrency().isBlank()) {
            setting.setCurrency(updated.getCurrency().trim());
        }
        if (updated.getBasicPrice() != null && !updated.getBasicPrice().isBlank()) {
            setting.setBasicPrice(updated.getBasicPrice().trim());
        }
        if (updated.getStandardPrice() != null && !updated.getStandardPrice().isBlank()) {
            setting.setStandardPrice(updated.getStandardPrice().trim());
        }
        if (updated.getPremiumPrice() != null && !updated.getPremiumPrice().isBlank()) {
            setting.setPremiumPrice(updated.getPremiumPrice().trim());
        }
        if (updated.getStudioEmail() != null) {
            setting.setStudioEmail(updated.getStudioEmail().trim());
        }
        if (updated.getStudioPhone() != null) {
            setting.setStudioPhone(updated.getStudioPhone().trim());
        }
        setting.setAcceptingBookings(updated.isAcceptingBookings());

        Setting saved = settingRepository.save(setting);
        return ResponseEntity.ok(saved);
    }
}
