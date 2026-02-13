import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Gallery() {
  const navigate = useNavigate();

  const categories = [
    { title: "Wedding", img: "https://source.unsplash.com/600x400/?wedding" },
    { title: "Portrait", img: "https://source.unsplash.com/600x400/?portrait" },
    { title: "Nature", img: "https://source.unsplash.com/600x400/?nature" },
    { title: "Events", img: "https://source.unsplash.com/600x400/?events" },
    { title: "Street", img: "https://source.unsplash.com/600x400/?street" },
    { title: "Fashion", img: "https://source.unsplash.com/600x400/?fashion" },
  ];

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4" data-aos="fade-up">
          Photography Categories
        </h2>
        <div className="row">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="col-md-4 mb-4"
              style={{ cursor: "pointer" }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => navigate(`/gallery/${cat.title.toLowerCase()}`)}
            >
              <div className="card shadow hover-scale">
                <img src={cat.img} className="card-img-top" alt={cat.title} />
                <div className="card-body text-center">
                  <h5>{cat.title}</h5>
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
