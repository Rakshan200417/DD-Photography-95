import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  // Mock category data with IDs
  const categories = {
    wedding: { id: 1 },
    portrait: { id: 2 },
    nature: { id: 3 },
    events: { id: 4 },
    street: { id: 5 },
    fashion: { id: 6 },
  };

  const packageTypes = [
    { id: 1, name: "Normal", price: "$50", details: "Basic coverage with standard photos" },
    { id: 2, name: "Medium", price: "$100", details: "Extended coverage with more photos" },
    { id: 3, name: "Luxurious", price: "$200", details: "Full coverage, premium editing, extra prints" },
  ];

  const categoryImages = {
    wedding: [
      "https://source.unsplash.com/600x400/?wedding,1",
      "https://source.unsplash.com/600x400/?wedding,2",
      "https://source.unsplash.com/600x400/?wedding,3",
      "https://source.unsplash.com/600x400/?wedding,4",
    ],
    portrait: [
      "https://source.unsplash.com/600x400/?portrait,1",
      "https://source.unsplash.com/600x400/?portrait,2",
      "https://source.unsplash.com/600x400/?portrait,3",
      "https://source.unsplash.com/600x400/?portrait,4",
    ],
    nature: [
      "https://source.unsplash.com/600x400/?nature,1",
      "https://source.unsplash.com/600x400/?nature,2",
      "https://source.unsplash.com/600x400/?nature,3",
      "https://source.unsplash.com/600x400/?nature,4",
    ],
    events: [
      "https://source.unsplash.com/600x400/?events,1",
      "https://source.unsplash.com/600x400/?events,2",
      "https://source.unsplash.com/600x400/?events,3",
      "https://source.unsplash.com/600x400/?events,4",
    ],
    street: [
      "https://source.unsplash.com/600x400/?street,1",
      "https://source.unsplash.com/600x400/?street,2",
      "https://source.unsplash.com/600x400/?street,3",
      "https://source.unsplash.com/600x400/?street,4",
    ],
    fashion: [
      "https://source.unsplash.com/600x400/?fashion,1",
      "https://source.unsplash.com/600x400/?fashion,2",
      "https://source.unsplash.com/600x400/?fashion,3",
      "https://source.unsplash.com/600x400/?fashion,4",
    ],
  };

  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const categoryId = categories[category]?.id || null;

  if (!categoryId) {
    return (
      <>
        <Navbar />
        <div className="container my-5 text-center">
          <h3>Invalid category selected!</h3>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">{displayCategory} Packages</h2>

        {/* Category Images */}
        <div className="row mb-4">
          {categoryImages[category]?.map((img, i) => (
            <div className="col-md-6 mb-4" key={i}>
              <div className="card shadow">
                <img
                  src={img}
                  className="card-img-top"
                  alt={`${displayCategory} ${i + 1}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="row">
          {packageTypes.map((pkg) => (
            <div className="col-md-4 mb-4" key={pkg.id}>
              <div className="card shadow p-3 text-center">
                <h5>{pkg.name} Package</h5>
                <p>{pkg.details}</p>
                <p>
                  <strong>Price: {pkg.price}</strong>
                </p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    navigate(
                      `/order?category=${category}&type=${pkg.name}&categoryId=${categoryId}&packageId=${pkg.id}`
                    )
                  }
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
