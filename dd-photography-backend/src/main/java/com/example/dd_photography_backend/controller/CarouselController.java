package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.model.Carousel;
import com.example.dd_photography_backend.model.Photo;
import com.example.dd_photography_backend.model.PhotoType;
import com.example.dd_photography_backend.repository.CarouselRepository;
import com.example.dd_photography_backend.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/carousel")
@CrossOrigin
public class CarouselController {

    @Autowired
    private PhotoRepository photoRepository;

    // GET all carousel images
    @GetMapping
    public List<Photo> getCarousel() {
        return photoRepository.findByType(PhotoType.CAROUSEL);
    }

    // UPDATE image
    @PutMapping("/{id}")
    public Photo updateCarousel(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image
    ) throws IOException {

        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // delete old file
        File old = new File(photo.getUrl());
        if (old.exists()) old.delete();

        // save new file
        String path = "uploads/carousel/";
        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        File dest = new File(path + filename);
        dest.getParentFile().mkdirs();
        image.transferTo(dest);

        photo.setUrl(path + filename);
        return photoRepository.save(photo);
    }
}
