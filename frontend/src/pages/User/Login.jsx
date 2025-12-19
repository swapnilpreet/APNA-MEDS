import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";
import { SetUser } from "../../redux/userSlice";
import { LoginUser } from "../../Apicalls/user";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
   const notify = (mes) => toast(mes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SetLoader(true));

      const response = await LoginUser(formData);
      console.log("res", response);

      if (!response.status) {
        throw new Error(response.message);
      }

      // success
      notify(response.message);
      localStorage.setItem("token", response.token);
      window.location.href = "/";
      dispatch(SetLoader(false));
    } catch (error) {
      notify(error.message);
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
            src="https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D"
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
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
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
