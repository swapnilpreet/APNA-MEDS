import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../css/Carousel.css";

const slides = [
  {
    heading: "Cetaphil day sensitive SKIN EXPERT",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1752867056/Banner-7_hl1n6t.avif",
    bgColor: "#95befd",
  },
  {
    heading: "UPGRADE your bedroom essentials",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1752867056/banner-1_ejikgc.avif",
    bgColor: "#ede7f6",
  },
  {
    heading: "Vitamin combos for immunity boost",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1752867056/Banner-3_nbi4ki.avif",
    bgColor: "#f3e5f5",
  },
  {
    heading: "UPGRADE your bedroom essentials",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1752867056/Banner-4_g9ep4j.avif",
    bgColor: "#ede7f6",
  },
  {
    heading: "Vitamin combos for immunity boost",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1752867056/Banner-2_lgm7rv.avif",
    bgColor: "#f3e5f5",
  },
  {
    heading: "Vitamin combos for immunity boost",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1752867056/Banner-6_tdehmn.avif",
    bgColor: "#f3e5f5",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const visibleSlides = isMobile ? [0] : [0, 1];

  return(
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="arrow-button left" onClick={goToPrevSlide}>
          <FaChevronLeft color="black" />
        </div>
        <div className="slide-group">
          {visibleSlides.map((offset) => {
            const index = (currentIndex + offset) % slides.length;
            const slide = slides[index];
            return (
              <div
                className="slide-card"
                key={index}
                style={{ backgroundColor: slide.bgColor }}
              >
                <h3 className="slide-heading">{slide.heading}</h3>
                <img className="slide-image" src={slide.image} alt="Slide" />
              </div>
            );
          })}
        </div>

        <div className="arrow-button right" onClick={goToNextSlide}>
          <FaChevronRight color="black" />
        </div>
      </div>

      <div className="dots-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>

    </div>
  );
};

export default Carousel;