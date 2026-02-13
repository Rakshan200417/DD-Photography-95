package com.example.dd_photography_backend.model;

import jakarta.persistence.*;

@Entity
public class GalleryImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private com.example.dd_photography_backend.model.GalleryCategory category;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public com.example.dd_photography_backend.model.GalleryCategory getCategory() { return category; }
    public void setCategory(com.example.dd_photography_backend.model.GalleryCategory category) { this.category = category; }
}
