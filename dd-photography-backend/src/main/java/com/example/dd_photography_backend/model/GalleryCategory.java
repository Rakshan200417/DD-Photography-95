package com.example.dd_photography_backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class GalleryCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GalleryImage> images;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<GalleryImage> getImages() { return images; }
    public void setImages(List<GalleryImage> images) { this.images = images; }
}
