import React from "react";
import "../css/MedicineCard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SetUser } from "../../redux/userSlice";
import { GetCurrentUser } from "../../Apicalls/user";
import { SetLoader } from "../../redux/LoadingSlice";
import { toast } from "react-toastify";


const MedicineCard = ({ medicine, onCompareToggle, isSelected }) => {
  const notify = (mes) => toast(mes);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const handleCardClick = () => {
    navigate(`/medicine/${medicine._id}`);
  };

  const handleAddToCart = async ({ medicineId }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/cart",
        { medicineId },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      if (response) {
        GetCurrUser();
        if (user?.myCarts?.includes(medicine?._id)) {
          notify("Medicine Remove from cart");
          // alert("Medicine Remove from cart");
        } else {
          notify("Medicine added to cart");
          // alert("Medicine added to cart");
        }
      } else {
        throw new Error("Failed to add medicine");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetCurrUser = async () => {
    try {
      const response = await GetCurrentUser();
      if (response) {
        dispatch(SetUser(response.data));
      } else {
        localStorage.removeItem("token");
      }
      dispatch(SetLoader(false));
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(SetLoader(false));
      console.log(error.message);
    }
  };

  return(
    <>
    <div
      className={`med-card ${isSelected ? "active-card" : ""}`}
      onClick={handleCardClick}
    >
      <div className="med-badge">
        {medicine.price > 0
          ? `${(
              ((medicine.price + 88 - medicine.price) / (medicine.price + 88)) *
              100
            ).toFixed()}% OFF`
          : "No Discount"}
      </div>

      <div className="med-image-box">
        <img src={medicine.image.url ? medicine.image.url :medicine.image} alt={medicine.name} className="med-image" />
      </div>

      <div className="med-info">
        <h3 className="med-name">{medicine.name}</h3>
        <div className="med-price-box">
          <span className="med-price">₹{medicine.price}</span>
          <span className="med-mrp">₹{medicine.price + 88}</span>
        </div>
      </div>

      <div className="med-actions">
        <button
          className={`compare-btn ${isSelected ? "selected" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle(medicine);
          }}
        >
          {isSelected ? "Selected" : "Compare"}
        </button>

        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart({ medicineId: medicine?._id });
          }}
        >
          {user?.myCarts?.includes(medicine?._id)
            ? "Remove from Cart"
            : "Add to Cart"}
        </button>
      </div>
    </div>
    </>
  );
};

export default MedicineCard;
