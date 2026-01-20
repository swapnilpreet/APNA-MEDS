import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../css/Carousel.css";

const slides = [
  {
    heading: "Cetaphil day sensitive SKIN EXPERT",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762321/Banner-apna-med/Banner-4_x2hjgy.avif",
    bgColor: "#9e574f",
  },
  {
    heading: "Excitement Pleasure & Satisfaction",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762320/Banner-apna-med/Banner-7_tey62j.avif",
    bgColor: "#ffffff",
  },
  {
    heading: "Zyaada Nutrition Chuno",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762320/Banner-apna-med/BannerImage_1_kgyupj.avif",
    bgColor: "#cbcb4f",
  },
  {
    heading: "Composition Strength Medical Effects",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762320/Banner-apna-med/Banner-6_nc0zk8.avif",
    bgColor: "#6f36a7",
  },
  {
    heading: "Vitamin & Supplements",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762320/Banner-apna-med/BannerImage_4_gg7da0.avif",
    bgColor: "#fff1e4",
  },
  {
    heading: "Diataal Health Supplements",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762320/Banner-apna-med/BannerImage_2_fmwzgq.avif",
    bgColor: "#efefef",
  },
  {
    heading: "Dermatologist Recommended brand",
    image: "https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762320/Banner-apna-med/BannerImage_3_vxlunv.avif",
    bgColor: "#e7e7e7",
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