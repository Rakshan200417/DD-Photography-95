import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminCarousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all slides
  const loadCarousel = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/carousel");
      setSlides(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load slides. Check server!");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarousel();
  }, []);

  // Update image
  const updateImage = async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(`http://localhost:8080/api/carousel/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Image updated successfully");
      loadCarousel();
    } catch (err) {
      console.error(err);
      alert("Error updating image");
    }
  };

  // Update title
  const updateTitle = async (id, title) => {
    try {
      await axios.put(`http://localhost:8080/api/carousel/${id}/title`, { title });
      loadCarousel();
    } catch (err) {
      console.error(err);
      alert("Error updating title");
    }
  };

  // Add new slide
  const addSlide = async () => {
    try {
      await axios.post("http://localhost:8080/api/carousel", {
        title: "New Slide",
        imageUrl: "default.jpg", // you can have a default placeholder image
      });
      loadCarousel();
    } catch (err) {
      console.error(err);
      alert("Error adding slide");
    }
  };

  // Delete slide
  const deleteSlide = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/carousel/${id}`);
      loadCarousel();
    } catch (err) {
      console.error(err);
      alert("Error deleting slide");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center mb-4">Admin Carousel</h2>

        <div className="text-center mb-3">
          <button className="btn btn-success" onClick={addSlide}>
            + Add New Slide
          </button>
        </div>

        <div className="row">
          {slides.map((slide) => (
            <div key={slide.id} className="col-md-6 mb-4">
              <div className="card">
                <img
                  src={`http://localhost:8080/${slide.imageUrl}`}
                  className="card-img-top"
                  alt={slide.title}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={slide.title}
                    onChange={(e) => updateTitle(slide.id, e.target.value)}
                  />
                  <label className="btn btn-primary me-2">
                    Update Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => updateImage(slide.id, e.target.files[0])}
                    />
                  </label>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteSlide(slide.id)}
                  >
                    Delete Slide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
