import React, { useState, useMemo, useEffect } from "react";
import "./Cart.css";
import Pagewrapper from "../../components/common/Pagewrapper";
import DeliveryDetails from "../../components/common/DeliveryDetails";
import Error from "../../components/common/Error";
import AddressCard from "../../components/common/AddressCard";
import { toast } from "react-toastify";
import axios from "axios";
import Footer from "../../components/common/Footer";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";
import MedicineLoader from "../../components/common/MedicineLoader";
import CartIteams from "./CartIteams";
import { ToastContainer } from "react-toastify";


const Cart = () => {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const [hasFetched, setHasFetched] = useState(false);
  const { loading } = useSelector((state) => state.loaders);

  const handlePayment = () => {
    dispatch(SetLoader(true));
    const amountInPaise = parseInt(totals.total * 100);
    const options = {
      key: "rzp_test_93GbPzDVgg9zAW",
      amount: amountInPaise,
      currency: "INR",
      name: "APNA-MEDS",
      description: "Medicine Order Payment",
      image: "/logo.png",
      handler: async function (response) {
        try {
          const orderPayload = {
            orderItems: cartItems.map((item) => ({
              name: item.name,
              qty: item.qty,
              image: item.image.url || item.image,
              price: item.discountedPrice,
              Medicine: item._id,
            })),
            shippingAddress: selectedAddress,
            patientDetails: {
              age: selectedPatient.age,
              name: selectedPatient.name,
            },
            paymentMethod: "Razorpay",
            itemsPrice: totals.price,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: totals.total,
            isPaid: true,
            paidAt: Date.now(),
            orderId: response.razorpay_payment_id,
          };
          await handleplaceOrder(orderPayload);
          dispatch(SetLoader(false));
        } catch (err) {
          alert("Payment succeeded but order creation failed.");
          console.error(err);
        }
      },
      prefill: {
        name: "Swapnil Ramteke",
        email: "user@example.com",
        contact: "8329207372",
      },
      theme: {
        color: "#0066ff",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  const handleplaceOrder = async (orderPayload) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/orders`,
        orderPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("place order response", response);
      if (response?.data?.success) {
        clearCarts();
        toast.success(response?.data?.message);
      } else {
        throw new Error("place order Error");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong in Placed Order");

      // toast.error("Something went wrong in Placed Order");
      // console.log(error);
    }
  };

  const clearCarts = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/users/clear-cart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("clear cart response", response);
      if (response?.data?.success) {
        setCartItems([]);
        // toast.success(response?.data?.message);
      } else {
        throw new Error(response.message || "Cart clear failed");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllCarts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/users/getcart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("get cart response", response);
      if (response?.data.success) {
        const updatedCart = response.data.data.map((item) => ({
          ...item,
          qty: item.qty || 1,
        }));
        setCartItems(updatedCart);
        setHasFetched(true);
      } else {
        throw new Error(response.message || "Cart fetch failed");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const RemoveFromCart = async ({ medicineId }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/users/cart`,
        { medicineId },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      if (response) getAllCarts();
    } catch (error) {
      console.log(error);
    }
  };

  const totals = useMemo(() => {
    const mrp = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );
    const price = cartItems.reduce(
      (sum, item) => sum + Number(item.discountedPrice) * Number(item.qty),
      0
    );
    const discount = mrp - price;
    return {
      mrp: Number(mrp.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      total: appliedCoupon
        ? Number((price - (price * 2) / 100).toFixed(2))
        : Number(price.toFixed(2)),
    };
  }, [cartItems, appliedCoupon]);

  const handleQtyChange = (id, qty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  const handleApplyCouponClick = () => setShowCouponInput(true);

  const handleVerifyCoupon = () => {
    if (couponCode.trim()) {
      if (couponCode === "SWAPNIL") {
        toast("Coupon Applied");
        setAppliedCoupon(couponCode.trim());
        setCouponCode("");
        setShowCouponInput(false);
      } else {
        toast.error("Wrong Coupon");
      }
    }
  };

  const handleopenClosed = () => setOpen((open) => !open);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    getAllCarts();
  }, []);

  if (loading) {
    return <MedicineLoader />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Pagewrapper>
        {cartItems.length > 0 ? (
          <div className="cart-container">
            <div className="cart-left">
              <div className="cart-header">
                <h3>{cartItems?.length} Items in your cart</h3>
                <button onClick={clearCarts}>Clear Cart</button>
              </div>
              {selectedPatient && selectedAddress && (
                <AddressCard
                  selectedPatient={selectedPatient}
                  selectedAddress={selectedAddress}
                  handleopenClosed={handleopenClosed}
                />
              )}

              <CartIteams
                cart={cartItems}
                RemoveFromCart={RemoveFromCart}
                handleQtyChange={handleQtyChange}
              />
            </div>

            <div className="cart-right">
              <div className="free-delivery">
                🚚 Yay! You get <strong>FREE</strong> delivery on this order.
              </div>

              <div className="coupon-area" onClick={handleApplyCouponClick}>
                🏷️ Apply Coupon
              </div>

              {showCouponInput && (
                <div className="coupon-box">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e)=>setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <button onClick={handleVerifyCoupon}>Verify</button>
                </div>
              )}

              {appliedCoupon && (
                <div className="applied-coupon">
                  ✅ Coupon <strong>{appliedCoupon}</strong> applied!
                </div>
              )}

              <div className="bill">
                <h4>Bill Summary</h4>
                <div className="bill-row">
                  <span>MRP Total</span>
                  <span>₹{totals.mrp}</span>
                </div>
                <div className="bill-row green">
                  <span>Discount</span>
                  <span>-₹{totals.discount}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery Charges</span>
                  <span>
                    <s>₹149.00</s>{" "}
                    <span style={{ color: "#00a859" }}>FREE</span>
                  </span>
                </div>
                <div className="bill-total">
                  <span>Total Amount</span>
                  <span>₹{totals.total}</span>
                </div>
                <p className="tax-note">Inclusive of all taxes*</p>

                {(!selectedPatient || !selectedAddress) && (
                  <button className="primary-btn" onClick={() => setOpen(true)}>
                    Select Patient & Address
                  </button>
                )}

                {selectedPatient && selectedAddress && (
                  <button className="primary-btn" onClick={handlePayment}>
                    Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          hasFetched && (
            <Error message="No Cart Found" btntext="Go to Home Page" />
          )
        )}
      </Pagewrapper>

      <DeliveryDetails
        isOpen={open}
        handleopenClosed={handleopenClosed}
        setSelectedPatient={setSelectedPatient}
        selectedPatient={selectedPatient}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
      <Footer />
    </>
  );
};

export default Cart;
