import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const notify = (mes) => toast(mes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loaders);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SetLoader(true));
      const{data}= await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/auth/login`,
        formData
      );
      if (data.success) {
        notify(data.message);
        localStorage.setItem("token", data.token);
        window.location.href="/";
        dispatch(SetLoader(false));
      } else {
        notify(data.message);
      }
    } catch (error) {
      notify(error);
      dispatch(SetLoader(false));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <img
            src="https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762933/Banner-apna-med/photo-1624727828489-a1e03b79bba8_tnwvya.jpg"
            alt="Login"
          />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="current-email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button className="login-btn" type="submit">
            {loading ? "Loading..." : "Login"}
          </button>
          <p className="signup-link">
            Don't have an account? <Link to="/signup">signup</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
