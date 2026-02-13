import Carousel from "react-bootstrap/Carousel";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/carousel")
      .then(res => setSlides(res.data));
  }, []);

  return (
    <Carousel className="mb-5">
      {slides.map(slide => (
        <Carousel.Item key={slide.id}>
          <img
            className="d-block w-100"
            src={`http://localhost:8080/${slide.url}`}
            alt="carousel"
            style={{ height: "500px", objectFit: "cover" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
