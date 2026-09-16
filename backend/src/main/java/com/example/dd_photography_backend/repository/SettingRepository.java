package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<Setting, Long> {
}
