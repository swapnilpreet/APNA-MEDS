import React from "react";
import "../css/ProductTabs.css";

const ProductTabs = ({medicine}) => {
  return (
    <div className="product-container">
      <div>
        <section className="product-section">
          <h3 className="product-heading">📝 Product Description of {medicine}</h3>
          <p className="product-paragraph">
            <strong>{medicine}</strong> is used for maintaining overall health and wellness...
          </p>
        </section>

        <section className="product-section">
          <h3 className="product-heading">🔬 Ingredients of {medicine}</h3>
          <ul className="product-list">
            <li className="product-list-item"><strong>Vitamins:</strong> A, B1, B6, B12, D, E...</li>
            <li className="product-list-item"><strong>Amino Acids:</strong> L-Arginine, L–Glutathione...</li>
            <li className="product-list-item"><strong>Minerals:</strong> Zinc, Selenium, Copper...</li>
            <li className="product-list-item"><strong>Lycopene:</strong> Natural antioxidant...</li>
          </ul>
        </section>

        <section className="product-section">
          <h3 className="product-heading">📌 Key Uses</h3>
          <p className="product-paragraph">
            Maintains energy, immunity, and promotes overall well-being.
          </p>
        </section>

        <section className="product-section">
          <h3 className="product-heading">🕒 How To Use</h3>
          <p className="product-paragraph">
            Take one tablet daily after a meal or as prescribed by your physician.
          </p>
        </section>

        <section className="product-section">
          <h3 className="product-heading">⚠️ Safety Information</h3>
          <ul className="product-list">
            <li className="product-list-item">Keep out of reach of children</li>
            <li className="product-list-item">Store in a cool, dry place</li>
            <li className="product-list-item">Do not exceed recommended dose</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ProductTabs;
