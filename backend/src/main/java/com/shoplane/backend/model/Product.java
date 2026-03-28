package com.shoplane.backend.model;

import jakarta.persistence.*;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private Double price;

    @Column(length = 2000)
    private String description;

    private String preview;
    private String category;
    private Boolean isAccessory = false;

    @Column(length = 2000)
    private String photosRaw;

    @Transient
    public List<String> getPhotos() {
        if (photosRaw == null || photosRaw.isBlank()) return List.of();
        return Arrays.asList(photosRaw.split(","));
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPreview() { return preview; }
    public void setPreview(String preview) { this.preview = preview; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Boolean getIsAccessory() { return isAccessory; }
    public void setIsAccessory(Boolean isAccessory) { this.isAccessory = isAccessory; }
    public String getPhotosRaw() { return photosRaw; }
    public void setPhotosRaw(String photosRaw) { this.photosRaw = photosRaw; }
}
