package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    List<GalleryImage> findByCategoryId(Long categoryId);
    Optional<GalleryImage> findByCategoryIdAndPackageTypeAndSlotNumber(Long categoryId, String packageType, Integer slotNumber);
}
