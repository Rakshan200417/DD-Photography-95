package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Object> findByNameIgnoreCase(String name);

    boolean existsByName(String name);
}
