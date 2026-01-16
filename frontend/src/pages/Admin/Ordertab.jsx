import React, { useEffect, useState } from "react";
import "./css/OrderTabs.css";
// import { GetAllOrdersByAdmin } from "../../Apicalls/order";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import { toast } from "react-toastify";
import Error from "../../components/common/Error";

const Ordertab = () => {
  const [orders, setOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      return error.response?.data?.message || "Failed to fetch orders";
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await axios.put(
        `/api/orders/${id}/shipping`,
        { shippingStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(`Status updated to ${data.data.shippingStatus}`);
      getAllOrders();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
  
  const totalPages = Math.ceil(sortedOrders.length / pageSize);
  const startIndex=(currentPage-1)*pageSize;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + pageSize);
  
  useEffect(()=>{
    getAllOrders();
  }, []);

  return (
    <div className="order-content">
     {sortedOrders.length>0 ? <>
      <h2>All Orders</h2>
      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>User</th>
              <th>Current Status</th>
              <th>Action</th>
              <th>Shipping Address</th>
              <th>Total Price</th>
              <th
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                Date {sortOrder === "asc" ? "↑" : "↓"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders &&
              paginatedOrders.map((order) => (
                <tr key={order?._id}>
                  <td>
                    {order?.paymentMethod}
                    {order?.orderId}
                  </td>
                  <td>{order?.user?.name}</td>
                  <td>{order?.shippingStatus}</td>
                  <td>
                    <select
                      className="status-select"
                      defaultValue={order?.shippingStatus}
                      onChange={(e) =>
                        handleStatusChange(order?._id, e.target.value)
                      }
                    >
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    {order?.shippingAddress?.address},{" "}
                    {order?.shippingAddress?.city},{" "}
                    {order?.shippingAddress?.country},{" "}
                    {order?.shippingAddress?.postalCode}
                  </td>
                  <td>{order?.totalPrice}</td>
                  <td>{new Date(order?.createdAt).toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
      />
      </> : <Error message={"No Order Found"}/>}

    </div>
  );
};

export default Ordertab;
