import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
      const response = await axios.get("https://dd-photography-95.onrender.com/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="content-container">
        <div className="container my-5 pt-5">
        <h2 className="text-center mb-4" data-aos="fade-up">Featured Categories</h2>
        <div className="row">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category, index) => (
              <div className="col-md-4 mb-4" key={category.id} data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
                <div className="card shadow h-100">
                  {/* Category Cover image */}
                  <img
                    src={
                      category.coverImage
                        ? category.coverImage.startsWith("http")
                          ? category.coverImage
                          : `https://dd-photography-95.onrender.com/uploads/${category.coverImage}`
                        : `https://loremflickr.com/400/300/${category.name ? category.name.replace(/\s+/g, ',').toLowerCase() : 'photography'}`
                    }
                    onError={(e) => {
                      e.target.src = `https://loremflickr.com/400/300/${category.name ? category.name.replace(/\s+/g, ',').toLowerCase() : 'photography'}`;
                    }}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                    alt={category.name}
                  />
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

      </div>
      <Footer />
    </>
  );
}
