package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.model.GalleryCategory;
import com.example.dd_photography_backend.model.GalleryImage;
import com.example.dd_photography_backend.repository.GalleryCategoryRepository;
import com.example.dd_photography_backend.repository.GalleryImageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/gallery/images")
@CrossOrigin(origins = "http://localhost:3000")
public class GalleryImageController {

    private final GalleryImageRepository galleryImageRepository;
    private final GalleryCategoryRepository galleryCategoryRepository;

    public GalleryImageController(GalleryImageRepository galleryImageRepository, GalleryCategoryRepository galleryCategoryRepository) {
        this.galleryImageRepository = galleryImageRepository;
        this.galleryCategoryRepository = galleryCategoryRepository;
    }

    @GetMapping
    public List<GalleryImage> getAllImages() {
        return galleryImageRepository.findAll();
    }

    @GetMapping("/category/{categoryId}")
    public List<GalleryImage> getImagesByCategory(@PathVariable Long categoryId) {
        return galleryImageRepository.findByCategoryId(categoryId);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addOrUpdateImage(
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "packageType", defaultValue = "Basic") String packageType,
            @RequestParam(value = "slotNumber", defaultValue = "1") Integer slotNumber,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("image") MultipartFile file) {

        try {
            GalleryCategory category = galleryCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Gallery category not found with ID: " + categoryId));

            String subfolder = "gallery/";
            String filename = System.currentTimeMillis() + "_" + packageType + "_" + slotNumber + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
            File uploadDir = new File(System.getProperty("user.dir"), "uploads/" + subfolder);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            File dest = new File(uploadDir, filename);
            java.nio.file.Files.copy(file.getInputStream(), dest.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Check if an image already exists for this category, packageType, and slotNumber
            Optional<GalleryImage> existing = galleryImageRepository
                    .findByCategoryIdAndPackageTypeAndSlotNumber(categoryId, packageType, slotNumber);

            GalleryImage galleryImage;
            if (existing.isPresent()) {
                galleryImage = existing.get();
                // Delete previous file from disk if exists
                if (galleryImage.getImageUrl() != null) {
                    File oldFile = new File("uploads/" + galleryImage.getImageUrl());
                    if (oldFile.exists()) oldFile.delete();
                }
            } else {
                galleryImage = new GalleryImage();
                galleryImage.setCategory(category);
                galleryImage.setPackageType(packageType);
                galleryImage.setSlotNumber(slotNumber);
            }

            galleryImage.setImageUrl(subfolder + filename);
            galleryImage.setTitle(title != null && !title.isEmpty() ? title : category.getName() + " - " + packageType + " " + slotNumber);
            galleryImage.setDescription(description != null ? description : packageType + " package photo");

            GalleryImage saved = galleryImageRepository.save(galleryImage);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        GalleryImage image = galleryImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gallery image not found with ID: " + id));

        if (image.getImageUrl() != null) {
            File file = new File("uploads/" + image.getImageUrl());
            if (file.exists()) {
                file.delete();
            }
        }

        galleryImageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
