import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { GetCurrentUser } from "../../Apicalls/user";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";
import { SetUser } from "../../redux/userSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const validateToken = async () => {
        try {
          dispatch(SetLoader(true));
          const response = await GetCurrentUser();
          if (response) {
            dispatch(SetUser(response.data));
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            navigate("/login");
          }
          dispatch(SetLoader(false));
        } catch (err) {
          console.log(err)
          dispatch(SetLoader(false));
          localStorage.removeItem("token");
          navigate("/login");
        }
      };

      validateToken();
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;

