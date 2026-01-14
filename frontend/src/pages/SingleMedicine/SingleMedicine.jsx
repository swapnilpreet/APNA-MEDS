import React, { useEffect, useState } from "react";
import "./SingleMedicine.css";
import Footer from "../../components/common/Footer";
import Pagewrapper from "../../components/common/Pagewrapper";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import ProductTabs from "../../components/common/ProductTabs";
import { useSelector } from "react-redux";
import { SetUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { TiTickOutline } from "react-icons/ti";
import { FaPlaneLock } from "react-icons/fa6";
import { TbTruckReturn } from "react-icons/tb";
import axios from "axios";

const SingleMedicine = () => {
  const { id } = useParams();
  const [medicine, setmedicine] = useState();
  // const [recomandationmed, setrecomandationmed] = useState();
  // const [showrecommendation, setshowrecommendation] = useState(false);

  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const formatPrice = (price) =>
    price < 100 ? price.toFixed(2) : Math.round(price);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryFormatted = deliveryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const getMedicine = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/medicine/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setmedicine(data.medicine);
        fetchrecommendation();
        setTimeout(() => {
          setshowrecommendation(true);
        }, 5000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // const fetchrecommendation = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_BASEURL}/api/recommendations/`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log("recomandation", response);
  //     if (response.data.success) {
  //       setrecomandationmed(response.data.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const AddtoCart = async (medicineId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/users/cart`,
        medicineId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response) {
        await GetCurrUser();
      } else {
        throw new Error(response?.message || "Add to cart failed");
      }
    } catch (error) {
      console.log(error.response?.data.message || error.message);
    }
  };

  const GetCurrUser = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.success) {
        dispatch(SetUser(data.data));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getMedicine();
  }, []);

  return (
    <>
      {medicine &&
        medicine?.map((med) => (
          <div key={med._id}>
            <Breadcrumb medicineName={med?.name} />
            <Pagewrapper>
              <div className="single-medicine-container">
                <div className="medicine-left">
                  <div className="medicine-image-box sticky">
                    <img
                      src={med?.image.url ? med?.image.url : med?.image}
                      alt={med?.name}
                    />
                  </div>
                </div>

                <div className="medicine-center scrollable-card">
                  <h2>{med?.name}</h2>
                  <p className="brand-name">{med?.brand} Pharmaceuticals Ltd</p>
                  <div className="unit">
                    <p>Strip of 10 Units</p>
                    <p>
                      Number of{" "}
                      {med.name.split(" ").includes("Cream")
                        ? "cream"
                        : "Strip"}{" "}
                      available {med?.countInStock}
                    </p>
                  </div>
                  <p className="mrp">
                    MRP ₹
                    <span className="line-through">
                      {" "}
                      {formatPrice(med.price)}
                    </span>
                  </p>
                  <span>Rs. {formatPrice(med?.discountedPrice)}</span>{" "}
                  <span className="per-unit">
                    ₹ {formatPrice(med?.price / 10)}/Unit{" "}
                  </span>
                  <div className="discount">{med.discountPercentage}% off</div>
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
                      <TbTruckReturn size={22} color="blue" /> 15 days easy
                      returns
                    </div>
                  </div>
                  <div className="composition">
                    <h4>Composition</h4>
                    <br />
                    <p>{med?.description}</p>
                  </div>
                  <div className="strength">
                    <button
                      className={`pill ${
                        med?.countInStock === 0 ? "out-of-stock" : ""
                      }`}
                      disabled={med?.countInStock === 0}
                      onClick={() => {
                        if (med?.countInStock === 0) return;
                        AddtoCart({ medicineId: med?._id });
                      }}
                    >
                      {med?.countInStock === 0
                        ? "Out of Stock"
                        : user?.myCarts?.includes(med?._id)
                        ? "Remove from Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                  <ProductTabs med={med} />
                </div>

              </div>
            </Pagewrapper>
            <Footer />
          </div>
        ))}
    </>
  );
};
export default SingleMedicine;
