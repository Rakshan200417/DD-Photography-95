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
import java.util.UUID;

@RestController
@RequestMapping("/api/gallery/images")
@CrossOrigin(origins = "http://localhost:3000")
public class GalleryImageController {

    private final GalleryImageRepository imageRepository;
    private final GalleryCategoryRepository categoryRepository;

    public GalleryImageController(GalleryImageRepository imageRepository,
                                  GalleryCategoryRepository categoryRepository) {
        this.imageRepository = imageRepository;
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public GalleryImage uploadImage(@RequestParam("title") String title,
                                    @RequestParam("image") MultipartFile file,
                                    @RequestParam("categoryId") Long categoryId) throws IOException {

        GalleryCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Save file locally
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String uploadDir = "uploads/";
        File dest = new File(uploadDir + fileName);
        dest.getParentFile().mkdirs();
        file.transferTo(dest);

        GalleryImage image = new GalleryImage();
        image.setTitle(title);
        image.setImageUrl("uploads/" + fileName);
        image.setCategory(category);

        return imageRepository.save(image);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        imageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
