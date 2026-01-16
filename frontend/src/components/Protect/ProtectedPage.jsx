import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";
import { SetUser } from "../../redux/userSlice";
import axios from "axios";
import Login from "../../pages/User/Login";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      // window.location.href = "/login";
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.log("expire-token");
        localStorage.removeItem("token");
        // window.location.href = "/login";
        navigate("/login");
        return;
      }
      const validateToken = async () => {
        try {
          dispatch(SetLoader(true));
          const response = await axios.get(
            `${import.meta.env.VITE_BASEURL}/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.success) {
            dispatch(SetUser(response.data.data));
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            // window.location.href = "/login";
            navigate("/login");
          }
          dispatch(SetLoader(false));
        } catch (err) {
          console.log(err);
          dispatch(SetLoader(false));
          localStorage.removeItem("token");
          // window.location.href = "/login";
          navigate("/login");
        }
      };
      validateToken();
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      // window.location.href = "/login";
      navigate("/login");
    }
  }, [token, navigate]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
