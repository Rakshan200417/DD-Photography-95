package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {
}
