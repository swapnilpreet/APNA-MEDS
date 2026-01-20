import React from "react";
import "../css/MedicineCard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SetUser } from "../../redux/userSlice";
// import { GetCurrentUser } from "../../Apicalls/user";
import { SetLoader } from "../../redux/LoadingSlice";
import { toast } from "react-toastify";

const MedicineCard = ({
  medicine,
  onCompareToggle,
  isSelected,
  hide = false,
}) => {
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
        `${import.meta.env.VITE_BASEURL}/api/users/cart`,
        { medicineId },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        },
      );
      if (response) {
        GetCurrUser();
        if (user?.myCarts?.includes(medicine?._id)) {
          notify("Medicine Remove from cart");
        } else {
          notify("Medicine added to cart");
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
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        dispatch(SetUser(response.data.data));
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

  return (
    <>
      <div
        className={`med-card ${isSelected ? "active-card" : ""}`}
        onClick={handleCardClick}
      >
        {!hide ? (
          <div className="med-badge">{medicine.discountPercentage}% OFF</div>
        ) : null}

        <div className="med-image-box">
          <img
            src={medicine.image.url ? medicine.image.url : medicine.image}
            alt={medicine.name}
            className="med-image"
          />
        </div>
        <div className="med-info">
          <h3 className="med-name">{medicine.name}</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="med-price-box">
              {medicine.discountPercentage > 0 ? (
                <>
                  <span className="med-price">₹{medicine.discountedPrice}</span>
                  <span className="med-mrp">₹{medicine.price}</span>
                </>
              ) : (
                <>
                <span className="med-price">₹{(medicine.price * 0.8).toFixed(2)}</span>
                <span className="med-mrp">₹{medicine.price}</span>
                </>
              )}
            </div>

            <div>
              {medicine.numReviews > 0 && (
                <div className="med-reviews">
                  ⭐ {medicine.rating.toFixed(1)} ({medicine.numReviews}{" "}
                  reviews)
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="med-actions">
          {!hide ? (
            <button
              className={`compare-btn ${isSelected ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onCompareToggle(medicine);
              }}
            >
              {isSelected ? "Selected" : "Compare"}
            </button>
          ) : null}

          <button
            className={`add-cart-btn ${
              medicine?.countInStock === 0 ? "out-of-stock" : ""
            }`}
            disabled={medicine?.countInStock === 0}
            onClick={(e) => {
              e.stopPropagation();

              if (medicine?.countInStock === 0) return;

              handleAddToCart({ medicineId: medicine?._id });
            }}
          >
            {medicine?.countInStock === 0
              ? "Out of Stock"
              : user?.myCarts?.includes(medicine?._id)
                ? "Remove from Cart"
                : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
};

export default MedicineCard;
