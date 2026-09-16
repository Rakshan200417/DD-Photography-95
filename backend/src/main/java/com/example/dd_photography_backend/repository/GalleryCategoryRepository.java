package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.GalleryCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryCategoryRepository extends JpaRepository<GalleryCategory, Long> { }
