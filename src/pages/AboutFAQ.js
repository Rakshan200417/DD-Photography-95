import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Accordion from 'react-bootstrap/Accordion';

export default function AboutFAQ() {
  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4" data-aos="fade-up">About Us</h2>
        <p data-aos="fade-up">
          DD Photography is your premier photography service, capturing moments that last forever.
          From weddings to portraits, we bring your memories to life with creativity and style.
        </p>

        <h2 className="text-center my-5" data-aos="fade-up">FAQ</h2>
        <Accordion defaultActiveKey="0" data-aos="fade-up">
          <Accordion.Item eventKey="0">
            <Accordion.Header>What services do you provide?</Accordion.Header>
            <Accordion.Body>
              We provide wedding, portrait, event, nature, street, and fashion photography.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>How can I book a session?</Accordion.Header>
            <Accordion.Body>
              You can book a session directly through our Order page or contact us via email/phone.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Do you offer prints?</Accordion.Header>
            <Accordion.Body>
              Yes! You can order prints of your favorite photos when you receive the gallery.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <Footer />
    </>
  );
}
