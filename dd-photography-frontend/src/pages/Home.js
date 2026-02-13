import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <>
      <Navbar />
      <HeroCarousel />

      <div className="container my-5">
        <h2 className="text-center mb-4" data-aos="fade-up">Featured Categories</h2>
        <div className="row">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category, index) => (
              <div className="col-md-4 mb-4" key={category.id} data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
                <div className="card shadow h-100">
                  {/* Placeholder image or category specific image if available */}
                  <img src={`https://source.unsplash.com/400x300/?${category.name ? category.name.replace(/\s+/g, ',') : 'photography'}`} className="card-img-top" alt={category.name} />
                  <div className="card-body text-center">
                    <h5 className="card-title">{category.name}</h5>
                    <p className="card-text">{category.description || "Capture your best moments."}</p>
                    <Link to={`/gallery/${category.name}`} className="btn btn-outline-primary btn-sm mt-2">View Gallery</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p>Loading categories...</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
