import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminGallery() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImageTitle, setNewImageTitle] = useState("");

  // Fetch all gallery categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/gallery/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a new category
  const addCategory = async () => {
    if (!newCategoryName) return;
    try {
      await axios.post("http://localhost:8080/api/gallery/categories", { name: newCategoryName });
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || "Error adding category");
    }
  };

  // Delete a category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/gallery/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || "Error deleting category");
    }
  };

  // Add an image to a category
  const addImage = async () => {
    if (!selectedCategory || !newImage) return;

    const formData = new FormData();
    formData.append("title", newImageTitle);
    formData.append("image", newImage);
    formData.append("categoryId", selectedCategory.id);

    try {
      await axios.post("http://localhost:8080/api/gallery/images", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setNewImage(null);
      setNewImageTitle("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || "Error uploading image");
    }
  };

  // Delete image
  const deleteImage = async (imageId) => {
    if (!window.confirm("Are you sure to delete this image?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/gallery/images/${imageId}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || "Error deleting image");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Manage Gallery</h2>

      {/* Add Category */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button className="btn btn-success" onClick={addCategory}>Add Category</button>
      </div>

      {/* List Categories */}
      {categories.map((cat) => (
        <div key={cat.id} className="mb-4 card p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>{cat.name}</h5>
            <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(cat.id)}>Delete Category</button>
          </div>

          {/* Add Image */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Image title"
              value={selectedCategory?.id === cat.id ? newImageTitle : ""}
              onChange={(e) => {
                setSelectedCategory(cat);
                setNewImageTitle(e.target.value);
              }}
              className="form-control mb-2"
            />
            <input
              type="file"
              onChange={(e) => {
                setSelectedCategory(cat);
                setNewImage(e.target.files[0]);
              }}
              className="form-control mb-2"
            />
            <button className="btn btn-primary" onClick={addImage}>Upload Image</button>
          </div>

          {/* List Images */}
          <div className="d-flex flex-wrap">
            {cat.images?.map((img) => (
              <div key={img.id} className="card me-2 mb-2" style={{ width: "150px" }}>
                <img src={`http://localhost:8080/${img.imageUrl}`} alt={img.title} className="card-img-top" />
                <div className="card-body p-2 text-center">
                  <p className="card-text mb-1">{img.title}</p>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteImage(img.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
