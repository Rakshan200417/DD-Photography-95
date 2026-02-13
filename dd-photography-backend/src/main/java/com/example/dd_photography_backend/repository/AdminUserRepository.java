package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Integer> {

    AdminUser findByUsername(String username);

}
