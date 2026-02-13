package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.model.Photo;
import com.example.dd_photography_backend.model.PhotoType;
import com.example.dd_photography_backend.repository.PhotoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "http://localhost:3000")
public class PhotoController {

    private final PhotoRepository photoRepository;

    public PhotoController(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    // Get photos by type
    @GetMapping
    public List<Photo> getPhotos(@RequestParam("type") PhotoType type) {
        return photoRepository.findByType(type);
    }

    // Add new photo
    @PostMapping
    public Photo addPhoto(@RequestParam("name") String name,
                          @RequestParam("type") PhotoType type,
                          @RequestParam("file") MultipartFile file) throws IOException {

        String folder = "uploads/" + type.toString().toLowerCase() + "/";
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(folder + filename);
        dest.getParentFile().mkdirs();
        file.transferTo(dest);

        Photo photo = new Photo();
        photo.setName(name);
        photo.setType(type);
        photo.setUrl(folder + filename);

        return photoRepository.save(photo);
    }

    // Update photo (name and/or file)
    @PutMapping("/{id}")
    public Photo updatePhoto(@PathVariable Long id,
                             @RequestParam(value = "name", required = false) String name,
                             @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        if (name != null) photo.setName(name);

        if (file != null) {
            // Delete old file
            File oldFile = new File(photo.getUrl());
            if (oldFile.exists()) oldFile.delete();

            String folder = "uploads/" + photo.getType().toString().toLowerCase() + "/";
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File dest = new File(folder + filename);
            dest.getParentFile().mkdirs();
            file.transferTo(dest);

            photo.setUrl(folder + filename);
        }

        return photoRepository.save(photo);
    }

    // Delete photo
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable Long id) {
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        // Delete file
        File file = new File(photo.getUrl());
        if (file.exists()) file.delete();

        photoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
