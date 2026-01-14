import React, { useEffect } from "react";
import { GiMedicines } from "react-icons/gi";
import "../css/MedicineLoader.css";

const MedicineLoader = ({ loading = true }) => {
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <GiMedicines className="loader-icon" />
    </div>
  );
};

export default MedicineLoader;
