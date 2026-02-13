package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> { }
