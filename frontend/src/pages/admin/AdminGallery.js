import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaImages,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCamera,
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes
} from "react-icons/fa";

const API_BASE = "http://localhost:8080/api/gallery";

export default function AdminGallery() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  // New Category Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatDescription, setNewCatDescription] = useState("");
  const [newCatCoverFile, setNewCatCoverFile] = useState(null);
  const [newCatCoverPreview, setNewCatCoverPreview] = useState(null);
  const [newCatBasicPrice, setNewCatBasicPrice] = useState("");
  const [newCatMediumPrice, setNewCatMediumPrice] = useState("");
  const [newCatPremiumPrice, setNewCatPremiumPrice] = useState("");
  const [activeTierTab, setActiveTierTab] = useState("Basic");

  // 4 image slots per tier for the New Category form
  // Structure: { Basic: [file, file, ...], Medium: [...], Premium: [...] }
  const [tierFiles, setTierFiles] = useState({
    Basic: [null, null, null, null],
    Medium: [null, null, null, null],
    Premium: [null, null, null, null]
  });
  const [tierPreviews, setTierPreviews] = useState({
    Basic: [null, null, null, null],
    Medium: [null, null, null, null],
    Premium: [null, null, null, null]
  });

  // Edit Modal State for Existing Categories
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverFile, setEditCoverFile] = useState(null);
  const [editCoverPreview, setEditCoverPreview] = useState(null);
  const [editBasicPrice, setEditBasicPrice] = useState("");
  const [editMediumPrice, setEditMediumPrice] = useState("");
  const [editPremiumPrice, setEditPremiumPrice] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Category Filter
  const [selectedCatFilter, setSelectedCatFilter] = useState("ALL");

  // Existing Category active tier view: { [catId]: 'Basic' | 'Medium' | 'Premium' }
  const [catTierView, setCatTierView] = useState({});

  // Quick upload state for existing category slot: { catId, tier, slot }
  const [uploadingSlot, setUploadingSlot] = useState(null);

  const showAlert = (msg, type = "success") => {
    setAlertInfo({ msg, type });
    setTimeout(() => setAlertInfo(null), 4000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching gallery categories:", err);
      showAlert("Failed to load categories from server", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Cover Image selection for New Category
  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCatCoverFile(file);
      setNewCatCoverPreview(URL.createObjectURL(file));
    }
  };

  // Handle Tier Image selection for New Category (slots 0..3)
  const handleTierFileSelect = (tier, slotIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedFiles = { ...tierFiles };
    updatedFiles[tier] = [...updatedFiles[tier]];
    updatedFiles[tier][slotIndex] = file;
    setTierFiles(updatedFiles);

    const updatedPreviews = { ...tierPreviews };
    updatedPreviews[tier] = [...updatedPreviews[tier]];
    updatedPreviews[tier][slotIndex] = URL.createObjectURL(file);
    setTierPreviews(updatedPreviews);
  };

  const removeTierFile = (tier, slotIndex) => {
    const updatedFiles = { ...tierFiles };
    updatedFiles[tier] = [...updatedFiles[tier]];
    updatedFiles[tier][slotIndex] = null;
    setTierFiles(updatedFiles);

    const updatedPreviews = { ...tierPreviews };
    updatedPreviews[tier] = [...updatedPreviews[tier]];
    updatedPreviews[tier][slotIndex] = null;
    setTierPreviews(updatedPreviews);
  };

  // Create New Category with Cover and Package Images
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      setSavingCategory(true);
      const formData = new FormData();
      formData.append("name", newCatName.trim());
      formData.append("description", newCatDescription.trim());

      if (newCatCoverFile) {
        formData.append("coverImage", newCatCoverFile);
      }
      if (newCatBasicPrice) formData.append("basicPrice", newCatBasicPrice);
      if (newCatMediumPrice) formData.append("mediumPrice", newCatMediumPrice);
      if (newCatPremiumPrice) formData.append("premiumPrice", newCatPremiumPrice);

      // Append Basic Images
      tierFiles.Basic.forEach((file) => {
        if (file) formData.append("basicImages", file);
      });

      // Append Medium Images
      tierFiles.Medium.forEach((file) => {
        if (file) formData.append("mediumImages", file);
      });

      // Append Premium Images
      tierFiles.Premium.forEach((file) => {
        if (file) formData.append("premiumImages", file);
      });

      await axios.post(`${API_BASE}/categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      showAlert(`Category "${newCatName}" created successfully with portfolio images!`);

      // Reset form
      setNewCatName("");
      setNewCatDescription("");
      setNewCatCoverFile(null);
      setNewCatCoverPreview(null);
      setNewCatBasicPrice("");
      setNewCatMediumPrice("");
      setNewCatPremiumPrice("");
      setTierFiles({
        Basic: [null, null, null, null],
        Medium: [null, null, null, null],
        Premium: [null, null, null, null]
      });
      setTierPreviews({
        Basic: [null, null, null, null],
        Medium: [null, null, null, null],
        Premium: [null, null, null, null]
      });

      fetchCategories();
    } catch (err) {
      console.error("Error creating category:", err);
      showAlert(err.response?.data?.message || err.response?.data || "Failed to create category", "danger");
    } finally {
      setSavingCategory(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name || "");
    setEditDescription(cat.description || "");
    setEditCoverFile(null);
    setEditCoverPreview(
      cat.coverImage
        ? cat.coverImage.startsWith("http")
          ? cat.coverImage
          : `http://localhost:8080/uploads/${cat.coverImage}`
        : null
    );
    setEditBasicPrice(cat.basicPrice || "");
    setEditMediumPrice(cat.mediumPrice || "");
    setEditPremiumPrice(cat.premiumPrice || "");
  };

  // Save Edit Category
  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    try {
      setSavingEdit(true);
      const formData = new FormData();
      formData.append("name", editName.trim());
      formData.append("description", editDescription.trim());
      if (editCoverFile) {
        formData.append("coverImage", editCoverFile);
      }
      if (editBasicPrice) formData.append("basicPrice", editBasicPrice);
      if (editMediumPrice) formData.append("mediumPrice", editMediumPrice);
      if (editPremiumPrice) formData.append("premiumPrice", editPremiumPrice);

      await axios.put(`${API_BASE}/categories/${editingCategory.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      showAlert(`Category "${editName}" updated successfully!`);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      showAlert(err.response?.data?.message || err.response?.data || "Failed to update category", "danger");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (cat) => {
    if (
      !window.confirm(
        `Are you sure you want to delete category "${cat.name}"?\nThis will remove the category and all its gallery images.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/categories/${cat.id}`);
      showAlert(`Category "${cat.name}" deleted successfully.`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      showAlert("Failed to delete category: " + (err.response?.data || err.message), "danger");
    }
  };

  // Upload or Replace Image in an Existing Category slot
  const handleSlotImageUpload = async (catId, tier, slotNumber, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingSlot(`${catId}_${tier}_${slotNumber}`);
      const formData = new FormData();
      formData.append("categoryId", catId);
      formData.append("packageType", tier);
      formData.append("slotNumber", slotNumber);
      formData.append("image", file);
      formData.append("title", `${tier} Slot ${slotNumber}`);

      await axios.post("http://localhost:8080/api/gallery/images", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      showAlert(`Uploaded photo for ${tier} Package Slot ${slotNumber}`);
      fetchCategories();
    } catch (err) {
      console.error("Error uploading slot image:", err);
      showAlert("Failed to upload image: " + (err.response?.data || err.message), "danger");
    } finally {
      setUploadingSlot(null);
    }
  };

  // Delete an Image from an existing category
  const handleDeleteImage = async (imgId, label = "image") => {
    if (!window.confirm(`Delete this ${label}?`)) return;

    try {
      await axios.delete(`http://localhost:8080/api/gallery/images/${imgId}`);
      showAlert("Photo deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting image:", err);
      showAlert("Failed to delete photo", "danger");
    }
  };

  // Helper to get image in a specific slot for a category and tier
  const getSlotImage = (cat, tier, slotNum) => {
    if (!cat.images || !cat.images.length) return null;
    // Look for exact match on packageType and slotNumber
    const found = cat.images.find(
      (img) =>
        (img.packageType?.toLowerCase() === tier.toLowerCase() ||
          (tier === "Medium" && img.packageType?.toLowerCase() === "standard")) &&
        img.slotNumber === slotNum
    );
    if (found) return found;

    // Fallback: if no slotNumber tagged, check by index within tier
    const tierImages = cat.images.filter(
      (img) =>
        !img.packageType ||
        img.packageType.toLowerCase() === tier.toLowerCase() ||
        (tier === "Medium" && img.packageType?.toLowerCase() === "standard")
    );
    return tierImages[slotNum - 1] || null;
  };

  return (
    <div className="container-fluid pb-5">
      {/* Alert Banner */}
      {alertInfo && (
        <div
          className={`alert alert-${alertInfo.type} alert-dismissible fade show shadow-sm mb-4 d-flex align-items-center gap-2`}
          role="alert"
        >
          {alertInfo.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
          <div>{alertInfo.msg}</div>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={() => setAlertInfo(null)}
          ></button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <FaImages className="text-primary" /> Gallery & Category Management
          </h2>
          <p className="text-muted mb-0">
            Add categories with main cover image and 4 portfolio photos per package (Basic, Medium, Premium).
          </p>
        </div>
        <div className="badge bg-dark px-3 py-2 fs-6 rounded-pill">
          {categories.length} Total Categories
        </div>
      </div>

      {/* ========================================================= */}
      {/* TOP SECTION: ADD NEW CATEGORY & PACKAGES                  */}
      {/* ========================================================= */}
      <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "16px", background: "#ffffff" }}>
        <div
          className="card-header bg-gradient py-3 px-4"
          style={{
            background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
            color: "#ffffff",
            borderRadius: "16px 16px 0 0"
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <FaPlus className="text-warning" /> Add New Category
            </h5>
            <span className="badge bg-warning text-dark px-3 py-1 fw-bold rounded-pill">
              Top Section
            </span>
          </div>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleCreateCategory}>
            <div className="row g-4 mb-4">
              {/* Left Column: Name & Description */}
              <div className="col-lg-7">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Category Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g. Wedding Photography, Portrait, Fashion..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Category Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Brief description of this service and what is included..."
                    value={newCatDescription}
                    onChange={(e) => setNewCatDescription(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <label className="form-label fw-bold small">Basic Price ($)</label>
                    <input type="number" className="form-control" placeholder="800" value={newCatBasicPrice} onChange={e => setNewCatBasicPrice(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-bold small">Standard Price ($)</label>
                    <input type="number" className="form-control" placeholder="1500" value={newCatMediumPrice} onChange={e => setNewCatMediumPrice(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-bold small">Premium Price ($)</label>
                    <input type="number" className="form-control" placeholder="3000" value={newCatPremiumPrice} onChange={e => setNewCatPremiumPrice(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Right Column: Main Category Cover Image */}
              <div className="col-lg-5">
                <label className="form-label fw-bold d-flex align-items-center gap-2">
                  <FaCamera className="text-primary" /> Main Category Cover Image
                </label>
                <div
                  className="border rounded p-3 text-center position-relative"
                  style={{
                    backgroundColor: "var(--surface-hover)",
                    borderColor: "var(--border-color)",
                    borderStyle: "dashed",
                    borderWidth: "2px",
                    minHeight: "155px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {newCatCoverPreview ? (
                    <div className="position-relative w-100" style={{ height: "135px" }}>
                      <img
                        src={newCatCoverPreview}
                        alt="Cover Preview"
                        className="w-100 h-100 rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1"
                        onClick={() => {
                          setNewCatCoverFile(null);
                          setNewCatCoverPreview(null);
                        }}
                        title="Remove cover"
                      >
                        <FaTimes size={12} />
                      </button>
                      <span className="badge bg-success position-absolute bottom-0 start-0 m-2">
                        Main Cover Selected
                      </span>
                    </div>
                  ) : (
                    <label className="w-100 h-100 d-flex flex-column justify-content-center align-items-center cursor-pointer m-0 py-3">
                      <FaUpload className="mb-2 fs-3" style={{ color: "var(--accent-color)" }} />
                      <span className="fw-semibold small" style={{ color: "var(--text-primary)" }}>
                        Click to select Main Cover Image
                      </span>
                      <span className="small mt-1" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        JPG, PNG, WEBP (Appears on Home & Gallery cards)
                      </span>
                      <input
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={handleCoverSelect}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Package Tier Photos Section (4 images each for Basic, Medium, Premium) */}
            <div className="p-3 bg-light rounded-3 mb-4 border">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="fw-bold mb-1 text-dark">
                    Package Portfolio Photos (4 Images Per Package)
                  </h6>
                  <p className="text-muted small mb-0">
                    Upload 4 preview photos for each tier: Basic, Medium, and Premium.
                  </p>
                </div>
                {/* Tier Tabs */}
                <div className="d-flex flex-wrap gap-2" role="group">
                  {["Basic", "Medium", "Premium"].map((tier) => {
                    const count = tierFiles[tier].filter(Boolean).length;
                    return (
                      <button
                        key={tier}
                        type="button"
                        className={`btn btn-sm fw-bold px-3 ${
                          activeTierTab === tier ? "btn-primary" : "btn-outline-secondary"
                        }`}
                        onClick={() => setActiveTierTab(tier)}
                      >
                        {tier} Package{" "}
                        <span className="badge bg-light text-dark ms-1">{count}/4</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots for the active tier tab */}
              <div className="row g-3">
                {[0, 1, 2, 3].map((slotIndex) => {
                  const preview = tierPreviews[activeTierTab][slotIndex];
                  return (
                    <div key={slotIndex} className="col-6 col-md-3">
                      <div
                        className="card h-100 border text-center position-relative shadow-sm"
                        style={{ minHeight: "150px", borderRadius: "10px", overflow: "hidden" }}
                      >
                        <div className="card-header py-1 px-2 border-bottom small d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">{activeTierTab} Slot {slotIndex + 1}</span>
                          {preview && <FaCheckCircle className="text-success" size={12} />}
                        </div>

                        <div className="card-body p-2 d-flex flex-column justify-content-center align-items-center">
                          {preview ? (
                            <div className="position-relative w-100" style={{ height: "95px" }}>
                              <img
                                src={preview}
                                alt={`Slot ${slotIndex + 1}`}
                                className="w-100 h-100 rounded"
                                style={{ objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                onClick={() => removeTierFile(activeTierTab, slotIndex)}
                                title="Remove photo"
                              >
                                <FaTimes size={10} />
                              </button>
                            </div>
                          ) : (
                            <label className="w-100 h-100 d-flex flex-column justify-content-center align-items-center cursor-pointer m-0 py-3">
                              <FaCamera className="text-muted mb-1 fs-5" />
                              <span className="small text-primary fw-semibold">Add Photo {slotIndex + 1}</span>
                              <input
                                type="file"
                                className="d-none"
                                accept="image/*"
                                onChange={(e) => handleTierFileSelect(activeTierTab, slotIndex, e)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-success btn-lg px-4 fw-bold shadow-sm"
                disabled={savingCategory}
              >
                {savingCategory ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Category & Uploading Photos...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" /> Save & Create Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM SECTION: EXISTING CATEGORIES                       */}
      {/* ========================================================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-0">Existing Categories & Photo Albums</h4>
          <p className="text-muted small mb-0">
            Edit category details, update main cover images, or add/replace photos in Basic, Medium, and Premium packages.
          </p>
        </div>
        <div>
          <select 
            className="form-select bg-dark text-white border-secondary shadow-sm fw-bold" 
            value={selectedCatFilter} 
            onChange={e => setSelectedCatFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading categories and portfolio...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="card shadow-sm border-0 text-center py-5">
          <h5 className="text-muted">No categories found</h5>
          <p className="text-muted small">Use the form above to add your first category!</p>
        </div>
      ) : (
        <div className="row g-4">
          {categories
            .filter(cat => selectedCatFilter === "ALL" || cat.id.toString() === selectedCatFilter)
            .map((cat) => {
            const currentCatTier = catTierView[cat.id] || "Basic";
            const coverSrc = cat.coverImage
              ? cat.coverImage.startsWith("http")
                ? cat.coverImage
                : `http://localhost:8080/uploads/${cat.coverImage}`
              : null;

            const totalImages = cat.images ? cat.images.length : 0;

            return (
              <div key={cat.id} className="col-12">
                <div
                  className="card shadow-sm border-0 overflow-hidden"
                  style={{ borderRadius: "16px" }}
                >
                  {/* Category Header Card */}
                  <div className="card-header border-bottom p-4">
                    <div className="row align-items-center g-3">
                      {/* Main Cover Thumbnail */}
                      <div className="col-auto">
                        <div
                          className="position-relative rounded overflow-hidden shadow-sm"
                          style={{ width: "90px", height: "90px", backgroundColor: "var(--surface-hover)" }}
                        >
                          {coverSrc ? (
                            <img
                              src={coverSrc}
                              alt={cat.name}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.target.src = "https://placehold.co/100x100?text=No+Cover";
                              }}
                            />
                          ) : (
                            <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-muted">
                              <FaCamera size={24} />
                              <span style={{ fontSize: "0.65rem" }}>No Cover</span>
                            </div>
                          )}
                          <span
                            className="badge bg-dark position-absolute bottom-0 start-0 w-100 text-center"
                            style={{ fontSize: "0.6rem", opacity: 0.85 }}
                          >
                            MAIN COVER
                          </span>
                        </div>
                      </div>

                      {/* Title and Description */}
                      <div className="col">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <h4 className="fw-bold mb-0" style={{ color: "var(--text-primary)" }}>{cat.name}</h4>
                          <span className="badge bg-secondary rounded-pill">
                            {totalImages} Photos
                          </span>
                        </div>
                        <p className="text-muted small mt-1 mb-0" style={{ maxWidth: "700px" }}>
                          {cat.description || (
                            <span className="fst-italic text-secondary">
                              No description added yet. Click &quot;Edit Details&quot; to add one.
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="col-auto d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                          onClick={() => openEditModal(cat)}
                        >
                          <FaEdit /> Edit Details
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                          onClick={() => handleDeleteCategory(cat)}
                        >
                          <FaTrash /> Delete Category
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Package Tiers Manager for this Category */}
                  <div className="card-body p-4 bg-light">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                      <div className="fw-bold text-secondary small">
                        PACKAGE PORTFOLIO SLOTS (4 PER PACKAGE):
                      </div>

                      {/* Tabs to switch between Basic, Medium, Premium */}
                      <div className="d-flex flex-wrap gap-2" role="group">
                        {["Basic", "Medium", "Premium"].map((tier) => {
                          const isCurrent = currentCatTier === tier;
                          // Count how many images in this tier
                          const count = [1, 2, 3, 4].filter(
                            (s) => getSlotImage(cat, tier, s) !== null
                          ).length;

                          return (
                            <button
                              key={tier}
                              type="button"
                              className={`btn btn-sm ${
                                isCurrent ? "btn-dark fw-bold" : "btn-outline-secondary"
                              }`}
                              onClick={() =>
                                setCatTierView({ ...catTierView, [cat.id]: tier })
                              }
                            >
                              {tier} Package <span className="badge bg-secondary ms-1">{count}/4</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4 Slots for Selected Package Tier */}
                    <div className="row g-3">
                      {[1, 2, 3, 4].map((slotNum) => {
                        const slotImg = getSlotImage(cat, currentCatTier, slotNum);
                        const isUploadingThis =
                          uploadingSlot === `${cat.id}_${currentCatTier}_${slotNum}`;

                        const imgUrl = slotImg
                          ? slotImg.imageUrl.startsWith("http")
                            ? slotImg.imageUrl
                            : `http://localhost:8080/uploads/${slotImg.imageUrl}`
                          : null;

                        return (
                          <div key={slotNum} className="col-6 col-md-3">
                            <div
                              className="card h-100 border shadow-sm position-relative text-center"
                              style={{
                                borderRadius: "12px",
                                overflow: "hidden"
                              }}
                            >
                              <div className="card-header py-1 px-2 border-bottom d-flex justify-content-between align-items-center">
                                <span className="badge bg-light text-dark fw-bold" style={{ fontSize: "0.75rem" }}>
                                  Slot {slotNum}
                                </span>
                                {slotImg ? (
                                  <span className="badge bg-success" style={{ fontSize: "0.65rem" }}>
                                    Active
                                  </span>
                                ) : (
                                  <span className="badge bg-warning text-dark" style={{ fontSize: "0.65rem" }}>
                                    Empty
                                  </span>
                                )}
                              </div>

                              <div className="card-body p-2 d-flex flex-column justify-content-center align-items-center">
                                {isUploadingThis ? (
                                  <div className="py-4">
                                    <span className="spinner-border spinner-border-sm text-primary"></span>
                                    <div className="small text-muted mt-1">Uploading...</div>
                                  </div>
                                ) : slotImg ? (
                                  <div className="w-100">
                                    <div
                                      className="rounded overflow-hidden position-relative mb-2"
                                      style={{ height: "120px" }}
                                    >
                                      <img
                                        src={imgUrl}
                                        alt={`Slot ${slotNum}`}
                                        className="w-100 h-100"
                                        style={{ objectFit: "cover" }}
                                        onError={(e) => {
                                          e.target.src =
                                            "https://placehold.co/150x120?text=Photo+Missing";
                                        }}
                                      />
                                    </div>

                                    {/* Action Buttons for this slot */}
                                    <div className="d-flex gap-1 justify-content-center">
                                      <label
                                        className="btn btn-outline-secondary btn-xs py-1 px-2 m-0 cursor-pointer"
                                        style={{ fontSize: "0.7rem" }}
                                        title="Replace with new photo"
                                      >
                                        Replace
                                        <input
                                          type="file"
                                          className="d-none"
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleSlotImageUpload(
                                              cat.id,
                                              currentCatTier,
                                              slotNum,
                                              e
                                            )
                                          }
                                        />
                                      </label>

                                      <button
                                        className="btn btn-outline-danger btn-xs py-1 px-2"
                                        style={{ fontSize: "0.7rem" }}
                                        onClick={() =>
                                          handleDeleteImage(slotImg.id, `Slot ${slotNum} photo`)
                                        }
                                        title="Delete photo"
                                      >
                                        <FaTrash size={10} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <label className="w-100 h-100 d-flex flex-column justify-content-center align-items-center cursor-pointer m-0 py-4 text-muted">
                                    <FaPlus className="text-secondary mb-1" />
                                    <span className="fw-semibold text-primary" style={{ fontSize: "0.75rem" }}>
                                      Upload Slot {slotNum}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                                      {currentCatTier} Package
                                    </span>
                                    <input
                                      type="file"
                                      className="d-none"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleSlotImageUpload(
                                          cat.id,
                                          currentCatTier,
                                          slotNum,
                                          e
                                        )
                                      }
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT CATEGORY MODAL                                       */}
      {/* ========================================================= */}
      {editingCategory && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <FaEdit className="text-warning" /> Edit Category: {editingCategory.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditingCategory(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-bold">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Category Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-4">
                    <label className="form-label fw-bold small">Basic Price ($)</label>
                    <input type="number" className="form-control" value={editBasicPrice} onChange={e => setEditBasicPrice(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-bold small">Standard Price ($)</label>
                    <input type="number" className="form-control" value={editMediumPrice} onChange={e => setEditMediumPrice(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-bold small">Premium Price ($)</label>
                    <input type="number" className="form-control" value={editPremiumPrice} onChange={e => setEditPremiumPrice(e.target.value)} />
                  </div>
                </div>

                {/* Main Cover Image Update */}
                <div className="mb-3">
                  <label className="form-label fw-bold d-flex align-items-center gap-2">
                    <FaCamera className="text-primary" /> Main Cover Image
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    {editCoverPreview && (
                      <div
                        className="rounded overflow-hidden border shadow-sm"
                        style={{ width: "100px", height: "80px" }}
                      >
                        <img
                          src={editCoverPreview}
                          alt="Cover"
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div>
                      <label className="btn btn-outline-primary btn-sm mb-1 cursor-pointer">
                        <FaUpload className="me-1" /> Choose New Cover Image
                        <input
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files[0];
                            if (f) {
                              setEditCoverFile(f);
                              setEditCoverPreview(URL.createObjectURL(f));
                            }
                          }}
                        />
                      </label>
                      <div className="text-muted small">
                        Updating the cover image will replace the current cover photo across the site.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary fw-bold"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                >
                  {savingEdit ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
          <style>{`
            /* Fix contrast for Dark Mode Modal */
            [data-theme='dark'] .modal-content {
              background-color: var(--surface-color) !important;
            }
            [data-theme='dark'] .modal-body label {
              color: var(--text-primary) !important;
            }
            [data-theme='dark'] .modal-body .form-control {
              background-color: var(--bg-color) !important;
              color: var(--text-primary) !important;
              border: 1px solid rgba(181, 98, 46, 0.4) !important;
            }
            [data-theme='dark'] .modal-body .form-control:focus {
              border-color: var(--accent-color) !important;
              box-shadow: 0 0 0 0.25rem rgba(181, 98, 46, 0.25) !important;
            }
            [data-theme='dark'] .modal-body .text-muted {
              color: var(--text-secondary) !important;
            }
            [data-theme='dark'] .modal-footer.bg-light {
              background-color: var(--bg-color) !important;
              border-top: 1px solid var(--border-color) !important;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
