import React, { useEffect, useState } from "react";
import Footer from "../../components/common/Footer";
import Pagewrapper from "../../components/common/Pagewrapper";
import { useSelector } from "react-redux";
import "./MyOrder.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Error from "../../components/common/Error";

const steps = ["Packed", "Shipped", "Out for Delivery", "Delivered"];

const MyOrder = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.users);

  const fetchGetMyOrders = async () => {
    try {
      let response;
      if (user.isAdmin) {
        response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      console.log("response orders", response);
      if (response.data.success) {
        setOrders(response.data.data);
      }
      toast(response.data.message);
    } catch (error) {
      // toast(error.message);
      console.log(error)
    }
  };

  const getStepIndex = (status) => steps.indexOf(status);

  const currentOrders = orders?.filter(
    (order) => order?.shippingStatus !== "Delivered"
  );
  const completedOrders = orders?.filter(
    (order) => order?.shippingStatus === "Delivered"
  );

  const displayedOrders =
    activeTab === "current" ? currentOrders : completedOrders;

  useEffect(() => {
    if (user) {
      fetchGetMyOrders();
    }
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Pagewrapper>
        <div className="order-container">
          <h2 className="order-heading">My Orders</h2>
          <div className="order-tabs">
            <button
              className={activeTab === "current" ? "active" : ""}
              onClick={() => {
                setActiveTab("current");
                setSelectedOrder(null);
              }}
            >
              Current Orders
            </button>
            <button
              className={activeTab === "completed" ? "active" : ""}
              onClick={() => {
                setActiveTab("completed");
                setSelectedOrder(null);
              }}
            >
              Completed Orders
            </button>
          </div>
          <div className="order-list">
            {displayedOrders?.length === 0 ? (
              // <p>No {activeTab} orders found.</p>
              <Error
                message={`No ${activeTab} orders found`}
                path="/cart"
                btntext="Place Order"
              />
            ) : (
              displayedOrders?.map((order) => (
                <div
                  key={order._id}
                  className={`order-card ${
                    selectedOrder?._id === order._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <p>
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
          {selectedOrder && (
            <div className="order-details">
              <h3>Order Details</h3>
              <p>
                <strong>Order ID:</strong> {selectedOrder?.orderId}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder?.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ₹{selectedOrder?.totalPrice}
              </p>
              <p>
                <strong>Shipping Address:</strong>{" "}
                {selectedOrder?.shippingAddress.address},{" "}
                {selectedOrder?.shippingAddress.city},{" "}
                {selectedOrder?.shippingAddress.country},{" "}
                {selectedOrder?.shippingAddress.postalcode}
              </p>
              <p>
                <strong>Order For:</strong> {selectedOrder?.patientDetails.name}
              </p>
              <p>
                <strong>Shipping Status:</strong>{" "}
                {selectedOrder?.shippingStatus}
              </p>
              <p>
                <strong>Delivered At:</strong>{" "}
                {selectedOrder?.deliveredAt
                  ? new Date(selectedOrder?.deliveredAt).toLocaleDateString(
                      "en-GB"
                    )
                  : "Not Delivered"}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {selectedOrder?.isPaid ? "Paid" : "Pending"}
              </p>
              {selectedOrder?.isPaid && (
                <div className="payment-box">
                  <h4>Payment Details</h4>
                  <p>
                    <strong>Method:</strong> {selectedOrder?.paymentMethod}
                  </p>
                  <p>
                    <strong>Transaction ID:</strong> {selectedOrder?.orderId}
                  </p>
                  <p>
                    <strong>Amount Paid:</strong> ₹{selectedOrder?.totalPrice}
                  </p>
                  <p>
                    <strong>Payment Date:</strong>{" "}
                    {new Date(selectedOrder?.paidAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              <h4>Products</h4>
              <div className="product-list">
                {selectedOrder?.orderItems.map((product, index) => (
                  <div className="product-card" key={index}>
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p>{product.name}</p>
                      <p>Qty: {product.qty}</p>
                      <p>Price: ₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h4>Shipping Progress</h4>
              <div className="status-tracker">
                {steps.map((step, idx) => {
                  const activeIndex = getStepIndex(
                    selectedOrder?.shippingStatus
                  );
                  return (
                    <div className="status-step" key={step}>
                      <div
                        className={`status-dot ${
                          idx <= activeIndex ? "active" : ""
                        }`}
                      ></div>
                      <span
                        className={`status-label ${
                          idx <= activeIndex ? "active" : ""
                        }`}
                      >
                        {step}
                      </span>
                      {idx < steps.length - 1 && (
                        <div
                          className={`status-line ${
                            idx < activeIndex ? "active" : ""
                          }`}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Pagewrapper>
      <Footer />
    </>
  );
};

export default MyOrder;
