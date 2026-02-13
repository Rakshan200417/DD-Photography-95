package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.model.GalleryCategory;
import com.example.dd_photography_backend.repository.GalleryCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class GalleryCategoryController {

    private final GalleryCategoryRepository categoryRepository;

    public GalleryCategoryController(GalleryCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<GalleryCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public GalleryCategory createCategory(@RequestBody GalleryCategory category) {
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
