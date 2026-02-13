package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.Carousel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarouselRepository extends JpaRepository<Carousel, Long> {
}
