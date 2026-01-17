import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "../css/CompareModal.css";

const CompareModal = ({ medicines, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="compare-overlay">
      <div className="compare-modal two-column">
        {/* Header */}
        <div className="compare-header">
          <h2>Compare Medicines</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        {/* Body */}
        <div className="compare-body two-items">
          {medicines.map((med) => (
            <div className="compare-card" key={med._id}>
              <div className="compare-image">
                <img src={med.image?.url || med.image} alt={med.name} />
              </div>

              <h3 className="medicine-name">{med.name}</h3>

              <div className="compare-info">
                <p><span>Brand</span>{med.brand}</p>
                <p><span>Category</span>{med.category}</p>
                <p><span>Composition</span>{med.name}</p>
              </div>

              <div className="price-section">
                <div className="discounted-price">₹{med.discountedPrice}</div>
                <div className="mrp">
                  MRP <span>₹{med.price}</span>
                </div>
                <div className="discount">
                  {med.discountPercentage}% OFF • Save ₹{med.discountAmount}
                </div>
              </div>

              <div className="rating-section">
                <span className={`rating ${med.rating > 0 ? "active" : ""}`}>
                  ⭐ {med.rating > 0 ? med.rating.toFixed(1) : "No Rating"}
                </span>
                <span className="reviews">
                  ({med.numReviews || "No"} Reviews)
                </span>
              </div>

              <div
                className={`stock ${
                  med.countInStock > 0 ? "in-stock" : "out-stock"
                }`}
              >
                {med.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
