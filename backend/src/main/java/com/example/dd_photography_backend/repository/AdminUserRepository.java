package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Integer> {

    AdminUser findByUsername(String username);

    Optional<AdminUser> findByEmail(String email);

    Optional<AdminUser> findByEmailIgnoreCase(String email);

    Optional<AdminUser> findByUsernameIgnoreCase(String username);

}
