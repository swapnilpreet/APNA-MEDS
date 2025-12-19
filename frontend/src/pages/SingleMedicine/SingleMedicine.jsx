import React, { useEffect, useState } from "react";
import "./SingleMedicine.css";
import Footer from "../../components/common/Footer";
import Pagewrapper from "../../components/common/Pagewrapper";
import { useParams } from "react-router-dom";
import { GetMedicineById } from "../../Apicalls/medicine";
import Breadcrumb from "../../components/common/Breadcrumb";
import ProductTabs from "../../components/common/ProductTabs";
import { AddMedicineTocart, GetCurrentUser } from "../../Apicalls/user";
import { useSelector } from "react-redux";
import { SetUser } from "../../redux/userSlice";
import { SetLoader } from "../../redux/LoadingSlice";
import { useDispatch } from "react-redux";
import { TiTickOutline } from "react-icons/ti";
import { FaPlaneLock } from "react-icons/fa6";
import { TbTruckReturn } from "react-icons/tb";

import medicineimage from "../../assets/medicineimage.jpg";
const SingleMedicine = () => {
  const { id } = useParams();
  const [medicine, setmedicine] = useState();
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  // console.log("user", user?.myCarts);

  const formatPrice = (price) =>
    price < 100 ? price.toFixed(2) : Math.round(price);
  const mrp = medicine?.price * 1.2;
  const perUnit = medicine?.price / 10;
  const discountPercent = ((mrp - medicine?.price) / mrp) * 100;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const deliveryFormatted = deliveryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  const getMedicine = async () => {
    try {
      const response = await GetMedicineById(id);
      if (response) {
        console.log("res", response);
        setmedicine(response);
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const AddtoCart = async (medicineId) => {
    try {
      const response = await AddMedicineTocart(medicineId);
      if (response) {
        GetCurrUser();
        console.log(response);
      } else {
        throw new Error("something went wrong add to cart");
      }
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    getMedicine();
  }, []);

  return (
    <>
      <Breadcrumb medicineName={medicine?.name} />
      <Pagewrapper>
        {medicine && (
          <div className="single-medicine-container">
            <div className="medicine-left">
              <div className="medicine-image-box sticky">
                <img src={medicine?.image.url ? medicine?.image.url :medicine?.image} alt={medicine?.name} />
              </div>
            </div>
            <div className="medicine-center scrollable-card">
              <h2>{medicine?.name}</h2>
              <p className="brand-name">
                {medicine?.brand} Pharmaceuticals Ltd
              </p>
              <div className="unit">
                <p>Strip of 10 Units</p>
                <p>Number of Strip available {medicine?.countInStock}</p>
              </div>
              <p className="mrp">
                MRP ₹<span className="line-through"> {formatPrice(mrp)}</span>
              </p>
              <span>Rs. {formatPrice(medicine?.price)}</span>{" "}
              <span className="per-unit">₹ {formatPrice(perUnit)}/Unit </span>
              <div className="discount">{discountPercent.toFixed(1)}% off</div>
              <div className="delivery">
                Get it by <b>{deliveryFormatted}</b>
              </div>
              <div className="features">
                <div>
                  <TiTickOutline size={22} color="green" /> 100% genuine
                  medicines
                </div>
                <div>
                  <FaPlaneLock size={22} color="orange" /> Safe & secure
                  payments
                </div>
                <div>
                  <TbTruckReturn size={22} color="blue" /> 15 days easy returns
                </div>
              </div>
              <div className="composition">
                <h4>Composition</h4>
                <br />
                <p>{medicine?.description}</p>
              </div>
              <div className="strength">
                <button
                  className="pill active"
                  onClick={() => AddtoCart({ medicineId: medicine?._id })}
                >
                  {user?.myCarts?.includes(medicine?._id)
                    ? "Remove from Cart"
                    : "Add to Cart"}
                </button>
              </div>
              <ProductTabs medicine={medicine?.name}/>
            </div>

            <div className="medicine-right sticky">
              <div className="recommend-box">
                <h5>Recommended Substitute</h5>
                <div className="substitute-card">
                  <img src={medicineimage} alt="Substitute" />
                  <div>
                    <p>
                      <b>Alkem Para 650 Tablet 20</b>
                    </p>
                    <p>₹15.92 | ₹0.8/Unit</p>
                    <button className="pill">Add</button>
                  </div>
                </div>
                <p className="note">6067 users bought this instead</p>
              </div>
            </div>
          </div>
        )}
      </Pagewrapper>
      <Footer />
    </>
  );
};
export default SingleMedicine;
