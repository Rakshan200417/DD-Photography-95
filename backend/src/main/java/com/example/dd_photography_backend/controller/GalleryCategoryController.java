package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.model.Category;
import com.example.dd_photography_backend.model.GalleryCategory;
import com.example.dd_photography_backend.model.GalleryImage;
import com.example.dd_photography_backend.repository.CategoryRepository;
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
@RequestMapping("/api/gallery/categories")
public class GalleryCategoryController {

    private final GalleryCategoryRepository categoryRepository;
    private final CategoryRepository categoryGeneralRepository;
    private final GalleryImageRepository galleryImageRepository;

    public GalleryCategoryController(GalleryCategoryRepository categoryRepository,
                                     CategoryRepository categoryGeneralRepository,
                                     GalleryImageRepository galleryImageRepository) {
        this.categoryRepository = categoryRepository;
        this.categoryGeneralRepository = categoryGeneralRepository;
        this.galleryImageRepository = galleryImageRepository;
    }

    @GetMapping
    public List<GalleryCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "basicPrice", required = false) Double basicPrice,
            @RequestParam(value = "mediumPrice", required = false) Double mediumPrice,
            @RequestParam(value = "premiumPrice", required = false) Double premiumPrice,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImageFile,
            @RequestParam(value = "basicImages", required = false) List<MultipartFile> basicImages,
            @RequestParam(value = "mediumImages", required = false) List<MultipartFile> mediumImages,
            @RequestParam(value = "premiumImages", required = false) List<MultipartFile> premiumImages) {

        try {
            GalleryCategory category = new GalleryCategory();
            category.setName(name.trim());
            category.setDescription(description != null ? description.trim() : "");
            if (basicPrice != null) category.setBasicPrice(basicPrice);
            if (mediumPrice != null) category.setMediumPrice(mediumPrice);
            if (premiumPrice != null) category.setPremiumPrice(premiumPrice);

            // Save cover image if provided
            if (coverImageFile != null && !coverImageFile.isEmpty()) {
                String subfolder = "categories/";
                String filename = System.currentTimeMillis() + "_" + coverImageFile.getOriginalFilename().replaceAll("\\s+", "_");
                File uploadDir = new File(System.getProperty("user.dir"), "uploads/" + subfolder);
                if (!uploadDir.exists()) uploadDir.mkdirs();
                File dest = new File(uploadDir, filename);
                java.nio.file.Files.copy(coverImageFile.getInputStream(), dest.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                category.setCoverImage(subfolder + filename);
            }

            GalleryCategory savedCategory = categoryRepository.save(category);

            // Sync with categories table
            try {
                Optional<Category> existingGeneral = categoryGeneralRepository.findByNameIgnoreCase(savedCategory.getName());
                Category generalCat = existingGeneral.orElseGet(Category::new);
                generalCat.setName(savedCategory.getName());
                generalCat.setDescription(savedCategory.getDescription());
                generalCat.setCoverImage(savedCategory.getCoverImage());
                categoryGeneralRepository.save(generalCat);
            } catch (Exception e) {
                System.err.println("Note: Could not sync to general categories table: " + e.getMessage());
            }

            // Save Package Images if provided (up to 4 per tier)
            saveTierImages(savedCategory, "Basic", basicImages);
            saveTierImages(savedCategory, "Medium", mediumImages);
            saveTierImages(savedCategory, "Premium", premiumImages);

            return ResponseEntity.ok(categoryRepository.findById(savedCategory.getId()).orElse(savedCategory));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to create category: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "basicPrice", required = false) Double basicPrice,
            @RequestParam(value = "mediumPrice", required = false) Double mediumPrice,
            @RequestParam(value = "premiumPrice", required = false) Double premiumPrice,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImageFile) {

        try {
            GalleryCategory category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

            String oldName = category.getName();

            if (name != null && !name.trim().isEmpty()) {
                category.setName(name.trim());
            }

            if (description != null) {
                category.setDescription(description.trim());
            }

            if (basicPrice != null) category.setBasicPrice(basicPrice);
            if (mediumPrice != null) category.setMediumPrice(mediumPrice);
            if (premiumPrice != null) category.setPremiumPrice(premiumPrice);

            // If a new cover image is uploaded
            if (coverImageFile != null && !coverImageFile.isEmpty()) {
                // Delete previous cover file if exists
                if (category.getCoverImage() != null) {
                    File oldFile = new File("uploads/" + category.getCoverImage());
                    if (oldFile.exists()) oldFile.delete();
                }

                String subfolder = "categories/";
                String filename = System.currentTimeMillis() + "_" + coverImageFile.getOriginalFilename().replaceAll("\\s+", "_");
                File uploadDir = new File(System.getProperty("user.dir"), "uploads/" + subfolder);
                if (!uploadDir.exists()) uploadDir.mkdirs();
                File dest = new File(uploadDir, filename);
                java.nio.file.Files.copy(coverImageFile.getInputStream(), dest.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                category.setCoverImage(subfolder + filename);
            }

            GalleryCategory updated = categoryRepository.save(category);

            // Sync with categories table
            try {
                Optional<Category> existingGeneral = categoryGeneralRepository.findByNameIgnoreCase(oldName);
                if (existingGeneral.isPresent()) {
                    Category cat = existingGeneral.get();
                    cat.setName(updated.getName());
                    cat.setDescription(updated.getDescription());
                    cat.setCoverImage(updated.getCoverImage());
                    categoryGeneralRepository.save(cat);
                }
            } catch (Exception e) {
                System.err.println("Note: Could not sync category update to general categories: " + e.getMessage());
            }

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update category: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/prices")
    public ResponseEntity<?> updateCategoryPrices(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Object> body) {
        try {
            GalleryCategory category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

            if (body.containsKey("basicPrice") && body.get("basicPrice") != null) {
                category.setBasicPrice(Double.valueOf(body.get("basicPrice").toString()));
            }
            if (body.containsKey("mediumPrice") && body.get("mediumPrice") != null) {
                category.setMediumPrice(Double.valueOf(body.get("mediumPrice").toString()));
            }
            if (body.containsKey("premiumPrice") && body.get("premiumPrice") != null) {
                category.setPremiumPrice(Double.valueOf(body.get("premiumPrice").toString()));
            }

            GalleryCategory updated = categoryRepository.save(category);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to update package prices: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            GalleryCategory category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

            String categoryName = category.getName();

            // Delete category cover image file
            if (category.getCoverImage() != null) {
                File cover = new File("uploads/" + category.getCoverImage());
                if (cover.exists()) cover.delete();
            }

            // Delete all associated gallery image files from disk
            if (category.getImages() != null) {
                for (GalleryImage img : category.getImages()) {
                    if (img.getImageUrl() != null) {
                        File imgFile = new File("uploads/" + img.getImageUrl());
                        if (imgFile.exists()) imgFile.delete();
                    }
                }
            }

            categoryRepository.deleteById(id);

            // Try to sync delete with general categories table
            try {
                categoryGeneralRepository.findByNameIgnoreCase(categoryName)
                        .ifPresent(categoryGeneralRepository::delete);
            } catch (Exception e) {
                System.err.println("Note: General category was not deleted (may have bookings): " + e.getMessage());
            }

            return ResponseEntity.ok().body("Category and associated gallery images deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to delete category: " + e.getMessage());
        }
    }

    private void saveTierImages(GalleryCategory category, String tier, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;

        int count = Math.min(files.size(), 4);
        for (int i = 0; i < count; i++) {
            MultipartFile file = files.get(i);
            if (file != null && !file.isEmpty()) {
                try {
                    String subfolder = "gallery/";
                    String filename = System.currentTimeMillis() + "_" + (i + 1) + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
                    File uploadDir = new File(System.getProperty("user.dir"), "uploads/" + subfolder);
                    if (!uploadDir.exists()) uploadDir.mkdirs();
                    File dest = new File(uploadDir, filename);
                    java.nio.file.Files.copy(file.getInputStream(), dest.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                    GalleryImage img = new GalleryImage();
                    img.setCategory(category);
                    img.setPackageType(tier);
                    img.setSlotNumber(i + 1);
                    img.setImageUrl(subfolder + filename);
                    img.setTitle(category.getName() + " - " + tier + " Sample " + (i + 1));
                    img.setDescription(tier + " Package photo");
                    galleryImageRepository.save(img);
                } catch (IOException e) {
                    System.err.println("Failed to save " + tier + " image slot " + (i + 1) + ": " + e.getMessage());
                }
            }
        }
    }
}

