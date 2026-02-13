package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.Photo;
import com.example.dd_photography_backend.model.PhotoType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByType(PhotoType type);
}
