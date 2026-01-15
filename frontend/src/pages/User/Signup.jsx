import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { SetLoader } from "../../redux/LoadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loaders);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(SetLoader(true));
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/auth/register`,
        formData
      );
      if (data.success) {
        toast.success(data.message);
        sendMail(data.data);
        setTimeout(() => {
          dispatch(SetLoader(false));
          navigate("/login");
        }, 4000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      toast.error(error?.response?.data?.message || "Something went wrong ❌");
    }
  };

  const sendMail = async (user) => {
    const verifyUrl = `${import.meta.env.VITE_FRONTEND}/api/auth/verify-email?token=${
      user.verificationToken
    }`;
    const htmlContent = `
    <h2>Welcome,${user.name}!</h2>
    <p>Click the link below to verify your email and activate your account</p>
    <a href="${verifyUrl}" target="_blank">Verify Email</a>
    <p>If you did not register, please ignore this email.</p>
  `;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/api/mail/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.email,
            subject: "Verify Email From - Apna-Meds",
            html: htmlContent,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      console.log("Email sent:", data);
      alert("Email sent successfully 🚀");
    } catch (error) {
      console.error("Send mail error:", error);
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
      />

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-image">
            <img
              src="https://res.cloudinary.com/dejqyvuqj/image/upload/v1767762892/Banner-apna-med/premium_photo-1661757221486-183030ef8670_g7ukt4.jpg"
              alt="Signup"
            />
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">{loading ? "Loading..." : "Sign Up"}</button>

            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
