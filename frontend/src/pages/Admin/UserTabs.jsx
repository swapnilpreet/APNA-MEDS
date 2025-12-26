import React, { useEffect, useState } from "react";
import "./css/UserTabs.css";
import { GetAllUsers } from "../../Apicalls/user";
import { toast } from "react-toastify";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASEURL;

const UserTabs = () => {
  // const BASE_URL = process.env.REACT_APP_API_URL;
  const [userData, setUserData] = useState([]);

  // Fetch all users
  const handleGetAllUsers = async () => {
    try {
      const response = await GetAllUsers();
      console.log("response", response);

      if (response.success) {
        setUserData(response.data);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("frontend-error", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Delete a user
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success(response?.data?.message);
      handleGetAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  return (
    <div className="user-content">
      <h2>All Users</h2>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {userData?.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.isAdmin ? "Admin" : "User"}</td>

                <td>
                  <button
                    className={`user-button ${
                      item.isAdmin ? "disabled delete" : "delete"
                    }`}
                    disabled={item.isAdmin}
                    onClick={() => !item.isAdmin && handleDeleteUser(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTabs;
