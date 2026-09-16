package com.example.dd_photography_backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class GalleryCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "basic_price")
    private Double basicPrice = 0.0;

    @Column(name = "medium_price")
    private Double mediumPrice = 0.0;

    @Column(name = "premium_price")
    private Double premiumPrice = 0.0;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GalleryImage> images;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public Double getBasicPrice() { return basicPrice != null ? basicPrice : 0.0; }
    public void setBasicPrice(Double basicPrice) { this.basicPrice = basicPrice; }

    public Double getMediumPrice() { return mediumPrice != null ? mediumPrice : 0.0; }
    public void setMediumPrice(Double mediumPrice) { this.mediumPrice = mediumPrice; }

    public Double getPremiumPrice() { return premiumPrice != null ? premiumPrice : 0.0; }
    public void setPremiumPrice(Double premiumPrice) { this.premiumPrice = premiumPrice; }

    public List<GalleryImage> getImages() { return images; }
    public void setImages(List<GalleryImage> images) { this.images = images; }
}
