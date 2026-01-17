import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./css/UserTabs.css";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";
import MedicineLoader from "../../components/common/MedicineLoader";
import Error from "../../components/common/Error";
const Usertab = () => {
  const [userData, setUserData] = useState([]);
  const { loading } = useSelector((state) => state?.loaders);
  const dispatch = useDispatch();
  // Fetch all users
  const handleGetAllUsers = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/users/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        // toast.success(response.data.message);
        setUserData(response.data.data);
      }
    } catch (error) {
      console.log("frontend-error", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  // Delete a user
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
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
    <>
      {loading ? (
        <MedicineLoader />
      ) : userData?.length === 0 ? (
        <Error message="No Users Found" />
      ) : (
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
                {userData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.isAdmin ? "Admin" : "User"}</td>

                    <td>
                      <button
                        className={`user-button ${
                          item.isAdmin ? "disabled delete" : "delete"
                        }`}
                        disabled={item.isAdmin}
                        onClick={() =>
                          !item.isAdmin && handleDeleteUser(item._id)
                        }
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
      )}
    </>
  );
};

export default Usertab;
