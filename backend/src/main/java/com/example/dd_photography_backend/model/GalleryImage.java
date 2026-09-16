package com.example.dd_photography_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class GalleryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;
    private String title;
    private String description;
    private double price;

    @Column(name = "package_type")
    private String packageType; // "Basic", "Medium", "Premium"

    @Column(name = "slot_number")
    private Integer slotNumber; // 1 to 4

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("images")
    private GalleryCategory category;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getPackageType() { return packageType; }
    public void setPackageType(String packageType) { this.packageType = packageType; }

    public Integer getSlotNumber() { return slotNumber; }
    public void setSlotNumber(Integer slotNumber) { this.slotNumber = slotNumber; }

    public GalleryCategory getCategory() { return category; }
    public void setCategory(GalleryCategory category) { this.category = category; }
}
