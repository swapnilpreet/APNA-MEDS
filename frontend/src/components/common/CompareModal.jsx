import React from "react";
import { FaTimes } from "react-icons/fa";
import "../css/CompareModal.css";

const CompareModal = ({ medicines, onClose }) => {
  return(
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Compare Medicines</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
        <div className="modal-body">
          {medicines.map((med) => (
            <div className="compare-card" key={med._id}>
              <img src={med.image.url ? med.image.url :med.image} alt={med.name} />
              <h3>{med.name}</h3>
              <p>
                <strong>Brand:</strong> {med.brand || "Generic Health"}
              </p>
              <p>
                <strong>Compound:</strong> {med.compound || "Paracetamol + XYZ"}
              </p>
              <p>
                <strong>Price:</strong> ₹{med.price}
              </p>
              <p>
                <strong>MRP:</strong> ₹{med.price + 88}
              </p>
              <p>
                <strong>Discount:</strong>{" "}
                {med.price > 0
                  ? `${(
                      ((med.price + 88 - med.price) / (med.price + 88)) *
                      100
                    ).toFixed()}% OFF`
                  : "No Discount"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
