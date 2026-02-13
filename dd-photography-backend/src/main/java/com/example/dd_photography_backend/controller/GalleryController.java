package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.model.Gallery;
import com.example.dd_photography_backend.repository.GalleryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "http://localhost:3000")
public class GalleryController {

    private final GalleryRepository galleryRepository;

    public GalleryController(GalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @GetMapping
    public List<Gallery> getAll() {
        return galleryRepository.findAll();
    }

    @PostMapping
    public Gallery create(@RequestBody Gallery gallery) {
        return galleryRepository.save(gallery);
    }

    @PutMapping("/{id}")
    public Gallery update(@PathVariable Long id, @RequestBody Gallery galleryDetails) {
        Gallery gallery = galleryRepository.findById(id).orElseThrow(() -> new RuntimeException("Gallery not found"));
        gallery.setCategoryName(galleryDetails.getCategoryName());
        gallery.setImageUrl(galleryDetails.getImageUrl());
        gallery.setDescription(galleryDetails.getDescription());
        gallery.setPrice(galleryDetails.getPrice());
        return galleryRepository.save(gallery);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        galleryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
