import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8080/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      await axios.post("http://localhost:8080/api/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || "Error adding category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    await axios.delete(`http://localhost:8080/api/categories/${id}`);
    fetchCategories();
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="mb-4 text-center">Manage Categories</h2>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleAddCategory}>Add</button>
        </div>
        <ul className="list-group">
          {categories.map(cat => (
            <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
              {cat.name}
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}
